import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../store/languageSlice";
import { agriNewsData } from "../constants/agriNewsData";
import { toggleSpeaking, stopSpeaking } from "../services/ttsService";

// Enable animation for Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function NewsScreen() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.value);

  const [expandedId, setExpandedId] = useState(null);
  const [speakingNewsId, setSpeakingNewsId] = useState(null);

  const translateText = (en, np) => (language === "EN" ? en : np);

  const handleLanguageToggle = () => {
    dispatch(setLanguage(language === "EN" ? "NP" : "EN"));
  };

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePlayButton = (item) => {
    const textToSpeak = translateText(
      `${item.title}. ${item.description}`,
      `${item.titleNP}. ${item.descriptionNP}`
    );

    const isSpeakingNow = toggleSpeaking(textToSpeak, language);
    setSpeakingNewsId(isSpeakingNow ? item.id : null);
  };

  useEffect(() => {
    stopSpeaking();
    setSpeakingNewsId(null);
  }, [language]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const renderNewsCard = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const isPlaying = speakingNewsId === item.id;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => toggleExpand(item.id)}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="newspaper-outline" size={22} color="#4CAF50" />
          <Text style={styles.title}>
            {translateText(item.title, item.titleNP)}
          </Text>

          <TouchableOpacity onPress={() => handlePlayButton(item)}>
            <Ionicons
              name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
              size={26}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        <Text
          style={styles.description}
          numberOfLines={isExpanded ? undefined : 2}
        >
          {translateText(item.description, item.descriptionNP)}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.source}>
            {translateText(item.source, item.sourceNP)}
          </Text>

          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={14} color="#777" />
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>

        <Text style={styles.readMore}>
          {isExpanded
            ? translateText("Show Less ▲", "कम देखाउनुहोस् ▲")
            : translateText("Read More ▼", "थप पढ्नुहोस् ▼")}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* HEADER */}
      <View style={styles.header}>
        {/* Left: Icon + Title */}
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="leaf" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>
            {translateText(
              "Agriculture & Veterinary News",
              "कृषि तथा पशुपन्छी समाचार"
            )}
          </Text>
        </View>

        {/* Right: Language Toggle */}
        <TouchableOpacity
          onPress={handleLanguageToggle}
          activeOpacity={0.85}
          style={styles.languageButton}
        >
          <Ionicons name="language-outline" size={16} color="#FFFFFF" />
          <Text style={styles.languageText}>{language}</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={agriNewsData}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },

  header: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 18,
    gap: 6,
  },

  languageText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  listContent: {
    padding: 16,
    backgroundColor: "#F6F8FA",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    lineHeight: 20,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },

  source: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  date: {
    fontSize: 12,
    color: "#777",
  },

  readMore: {
    marginTop: 6,
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
    textAlign: "right",
  },
});


