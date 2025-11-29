const Machine = require('../models/Machine');

// @desc    Get all machines with filtering, sorting, and pagination
// @route   GET /api/machines
// @access  Public
const getMachines = async (req, res) => {
  // 1. Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // 2. Advanced filtering (for price ranges, date ranges, etc.)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let query = Machine.find(JSON.parse(queryStr));

  // 3. Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default sort by newest
  }

  // 4. Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v'); // Exclude version key by default
  }

  // 5. Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);

  // Execute query
  const machines = await query;
  const total = await Machine.countDocuments(JSON.parse(queryStr));

  res.status(200).json({
    success: true,
    count: machines.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: machines
  });
};

// @desc    Get single machine with availability check
// @route   GET /api/machines/:id
// @access  Public
const getMachine = async (req, res) => {
  // Check if ID is valid
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid machine ID format'
    });
  }

  const machine = await Machine.findById(req.params.id)
    .lean() // Convert to plain JS object for performance
    .cache({ key: req.params.id }); // Optional caching

  if (!machine) {
    return res.status(404).json({
      success: false,
      error: 'Machine not found'
    });
  }

  // Add availability status
  const now = new Date();
  machine.isAvailable = now >= new Date(machine.availableFrom) && 
                       now <= new Date(machine.availableTo);

  res.status(200).json({
    success: true,
    data: machine
  });
};

// @desc    Create new machine with data validation
// @route   POST /api/machines
// @access  Private/Admin
const createMachine = async (req, res) => {
  // 1. Validate required fields
  const requiredFields = ['toolName', 'category', 'rentalPricePerHour', 'availableFrom', 'availableTo'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // 2. Validate category
  const validCategories = ['Tractor', 'Tiller', 'Harvester'];
  if (!validCategories.includes(req.body.category)) {
    return res.status(400).json({
      success: false,
      error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
    });
  }

  // 3. Validate dates
  if (new Date(req.body.availableFrom) >= new Date(req.body.availableTo)) {
    return res.status(400).json({
      success: false,
      error: 'Available To date must be after Available From date'
    });
  }

  // 4. Create machine with transaction (in case you have related collections)
  const session = await Machine.startSession();
  session.startTransaction();
  
  try {
    const machine = await Machine.create([req.body], { session });
    
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: machine[0]
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Machine with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update machine with proper change tracking
// @route   PUT /api/machines/:id
// @access  Private/Admin
const updateMachine = async (req, res) => {
  // 1. Check if ID is valid
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid machine ID format'
    });
  }

  // 2. Get the current machine to track changes
  const currentMachine = await Machine.findById(req.params.id);
  if (!currentMachine) {
    return res.status(404).json({
      success: false,
      error: 'Machine not found'
    });
  }

  // 3. Validate updates if needed
  if (req.body.availableFrom && req.body.availableTo) {
    if (new Date(req.body.availableFrom) >= new Date(req.body.availableTo)) {
      return res.status(400).json({
        success: false,
        error: 'Available To date must be after Available From date'
      });
    }
  }

  // 4. Update with change tracking
  const updates = Object.keys(req.body);
  const allowedUpdates = ['toolName', 'category', 'rentalPricePerHour', 'availableFrom', 'availableTo', 'pickupOption', 'rentalTerms'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({
      success: false,
      error: 'Invalid updates!'
    });
  }

  try {
    updates.forEach(update => currentMachine[update] = req.body[update]);
    await currentMachine.save();

    res.status(200).json({
      success: true,
      data: currentMachine
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Update failed'
    });
  }
};

// @desc    Delete machine with cleanup logic
// @route   DELETE /api/machines/:id
// @access  Private/Admin
const deleteMachine = async (req, res) => {
  // 1. Check if ID is valid
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid machine ID format'
    });
  }

  const session = await Machine.startSession();
  session.startTransaction();

  try {
    const machine = await Machine.findByIdAndDelete(req.params.id)
      .session(session);

    if (!machine) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: 'Machine not found'
      });
    }

    // Here you could add logic to clean up related data
    // For example: await Rental.deleteMany({ machine: req.params.id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getMachines,
  getMachine,
  createMachine,
  updateMachine,
  deleteMachine
};