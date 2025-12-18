import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import ItemSelector from "../components/ItemSelector";
import { createPrebooking } from "../services/prebookingService";

export default function PrebookingScreen() {
  const { user } = useContext(AuthContext);
  const [itemType, setItemType] = useState("crop");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [preferredDate, setPreferredDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (user.role !== "user") {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16 }}>
          Only users can prebook crops or tools.
        </Text>
      </View>
    );
  }

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) setPreferredDate(date);
  };

  const handleSubmit = async () => {
    if (!selectedItem || !quantity) {
      return Alert.alert("Error", "Please select an item and quantity.");
    }
    if (quantity <= 0)
      return Alert.alert("Error", "Quantity must be greater than 0.");

    const data = {
      user_id: user.id,
      item_id: selectedItem._id,
      item_type: itemType,
      quantity: parseInt(quantity),
      preferred_date: preferredDate,
      notes,
    };

    try {
      setLoading(true);
      await createPrebooking(data);
      Alert.alert(
        "Success",
        `Prebooking created for ${selectedItem.productName}!`
      );
      setSelectedItem(null);
      setQuantity("");
      setNotes("");
      setPreferredDate(new Date());
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create prebooking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.title}>Prebook Crops / Tools</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, itemType === "crop" && styles.activeToggle]}
          onPress={() => {
            setItemType("crop");
            setSelectedItem(null);
          }}
        >
          <Text
            style={
              itemType === "crop" ? styles.activeToggleText : styles.toggleText
            }
          >
            Crops
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, itemType === "tool" && styles.activeToggle]}
          onPress={() => {
            setItemType("tool");
            setSelectedItem(null);
          }}
        >
          <Text
            style={
              itemType === "tool" ? styles.activeToggleText : styles.toggleText
            }
          >
            Tools
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        Select {itemType === "crop" ? "Crop" : "Tool"}:
      </Text>
      <ItemSelector
        itemType={itemType}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      <Text style={styles.label}>Quantity:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <Text style={styles.label}>Preferred Date:</Text>
      <TouchableOpacity
        style={styles.datePickerBtn}
        onPress={() => setShowDatePicker(true)}
      >
        <FontAwesome5 name="calendar-alt" size={16} color="#fff" />
        <Text style={styles.datePickerText}>
          {preferredDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={preferredDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Notes (optional):</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Additional notes..."
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Prebook Now</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------------------
// Styles
// ---------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#4CAF50",
  },
  toggleRow: { flexDirection: "row", marginBottom: 12 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  activeToggle: { backgroundColor: "#4CAF50" },
  toggleText: { color: "#4CAF50", fontWeight: "bold" },
  activeToggleText: { color: "#fff", fontWeight: "bold" },
  label: { marginTop: 12, marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    marginVertical: 8,
  },
  datePickerText: { color: "#fff", marginLeft: 8 },
  submitBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#388E3C",
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
