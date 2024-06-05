import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { updateDoc, collection, doc } from "firebase/firestore";

const FlashCard = ({ id, userId, word, meaning, icount, onDelete }) => {
  const [click, setClick] = useState(false);
  const [count, setCount] = useState(icount);
  const handlePress = async () => {
    setClick(!click);
    const ncount = count + 0.5;
    setCount(ncount);
    await updateCount(id, ncount);
  };
  const handleLongPress = () => {
    onDelete();
  };
  const updateCount = async (id, ncount) => {
    await updateDoc(doc(db, "flashcards", userId, "userfcards", id),{ count: ncount });
  };
  return (
    <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress}>
      <View className="rounded-lg overflow-hidden shadow-md bg-[#2C7873] w-44 h-32 p-2 m-1  flex justify-center items-center">
        {!click ? (
          <Text className="text-lg font-bold mb-2 text-white">
            {word ? word : "No word available"}
          </Text>
        ) : (
          <ScrollView style={{ maxHeight: 80 }} nestedScrollEnabled={true}>
            <Text className="text-white">
              {meaning ? meaning : "No meaning available"}
            </Text>
          </ScrollView>
        )}
        <Text className="absolute bottom-2 right-3 text-green-400">
          {Math.ceil(count)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FlashCard;
