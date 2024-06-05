import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FlashCard from "../components/FlashCard";
import { randomUUID } from "expo-crypto"; // Importing randomUUID from expo-crypto
import { db } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [meaning, setMeaning] = useState("");
  const [uId, setUId] = useState("");
  const [loadm, setLoadm] = useState(false);
  const [loadf, setLoadf] = useState(false);
  const [fail, setFail] = useState(false);

  const [flashCards, setFlashCards] = useState([]);
  useEffect(() => {
    const fetchOrCreateUserId = async () => {
      // Check if the UUID is stored in AsyncStorage
      let userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        // If UUID doesn't exist in AsyncStorage, generate a new one
        userId = await randomUUID();
        // Store the UUID in AsyncStorage for future use
        await AsyncStorage.setItem("userId", userId);
      }
      // Set the UUID state
      setUId(userId);
    };

    fetchOrCreateUserId();
  }, []);

  useEffect(() => {
    const getCards = async () => {
      if (uId) {
        setLoadf(true);
        const q = await getDocs(
          collection(db, "flashcards", uId, "userfcards")
        );
        const cards = [];
        q.forEach((doc) => {
          cards.push({
            id: doc.id,
            word: doc.data().word,
            meaning: doc.data().meaning,
            count: doc.data().count,
          });
        });
        setFlashCards(cards);
        setLoadf(false);
      }
    };
    getCards();
  }, [uId]);
  const fetchMeaning = async () => {
    try {
      setLoadm(true);
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${inputText}`
      );
      if (!response.ok) {
        setLoadm(false);
        setFail(true);
        throw new Error("Failed to fetch meaning");
      }
      const data = await response.json();
      setMeaning(data[0].meanings[0].definitions[0].definition);
      console.log("done");
      console.log(uId);
      setLoadm(false);
      setFail(false);
    } catch (error) {
      console.log("Error fetching: ", error);
      setMeaning("");
    }
  };
  const handleAddToFlashCards = async () => {
    if (inputText && meaning) {
      const newFlashCard = {
        word: inputText,
        meaning: meaning,
        count: 0,
      };
      try {
        const docRef = await addDoc(
          collection(db, "flashcards", uId, "userfcards"),
          newFlashCard
        );
        const id = docRef.id;
        console.log("flashcard adde to database");

        setFlashCards([{ count, ...newFlashCard }, ...flashCards]);
        console.log(flashCards);
        setInputText("");
        setMeaning("");

        // Add animation for new card
      } catch (error) {
        console.log("error adding flashcard: ", error);
      }
    }
  };
  const handleReset = () => {
    setInputText("");
    setMeaning("");
  };
  const handleDeleteCard = async (id) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await deleteDoc(doc(collection(db, "flashcards", uId, "userfcards"), id));
      setFlashCards(flashCards.filter((card) => card.id !== id));
    } catch (error) {
      console.log("Error deleting flashcard:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center mt-8  bg-[#021C1E]">
      <Text className="text-lg text-white font">F L A S H W O R D S</Text>
      <TextInput
        className="mt-5 rounded-sm bg-[#6FB98F] w-80 p-2 h-12 mb-4"
        placeholder="Enter a word.."
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={fetchMeaning}
        returnKeyType="done"
      />
      {loadm ? (
        <View className=" mb-4">
          <Text className="text-white">Loading...</Text>
        </View>
      ) : meaning?.length > 0 ? (
        <View className="ml-4 mr-4 ">
          <Text className=" text-white">{meaning}</Text>
        </View>
      ) : fail ? (
        <View className="ml-4 mr-4 mb-4">
          <Text className="text-white">Failed to fetch meaning</Text>
        </View>
      ) : null}

      {meaning && (
        <View className="flex-row justify-evenly w-64 mb-4 mt-4">
          <Button
            title={"Create flashcard"}
            onPress={handleAddToFlashCards}
            disabled={!inputText || !meaning}
          />
          <Button title={"Reset"} onPress={handleReset} disabled={!inputText} />
        </View>
      )}
      {loadf ? (
        <View className="flex items-center justify-center h-56 ">
          <Text className=" text-white">Loading...</Text>
        </View>
      ) : flashCards?.length > 0 ? (
        <FlatList
          data={flashCards}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <FlashCard
              key={item.id}
              id={item.id}
              word={item.word}
              meaning={item.meaning}
              icount={item.count}
              onDelete={() => handleDeleteCard(item.id)}
              userId={uId}
            />
          )}
        />
      ) : (
        <View className="flex items-center justify-center h-56">
          <Text className="text-white">No flashcards.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;
