import { color } from "@/constants/colors";
import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

const ANATOMY_SVG = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 4.66669V14" stroke="#877AF7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.99967 12C1.82286 12 1.65329 11.9298 1.52827 11.8047C1.40325 11.6797 1.33301 11.5101 1.33301 11.3333V2.66667C1.33301 2.48986 1.40325 2.32029 1.52827 2.19526C1.65329 2.07024 1.82286 2 1.99967 2H5.33301C6.04025 2 6.71853 2.28095 7.21863 2.78105C7.71872 3.28115 7.99967 3.95942 7.99967 4.66667C7.99967 3.95942 8.28063 3.28115 8.78072 2.78105C9.28082 2.28095 9.9591 2 10.6663 2H13.9997C14.1765 2 14.3461 2.07024 14.4711 2.19526C14.5961 2.32029 14.6663 2.48986 14.6663 2.66667V11.3333C14.6663 11.5101 14.5961 11.6797 14.4711 11.8047C14.3461 11.9298 14.1765 12 13.9997 12H9.99967C9.46924 12 8.96053 12.2107 8.58546 12.5858C8.21039 12.9609 7.99967 13.4696 7.99967 14C7.99967 13.4696 7.78896 12.9609 7.41389 12.5858C7.03882 12.2107 6.53011 12 5.99967 12H1.99967Z" stroke="#877AF7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const BIOCHEM_SVG = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.33299 1.33331V5.33331C9.3329 5.55697 9.38906 5.77706 9.49632 5.97331L13.1697 12.6933C13.2808 12.8964 13.3371 13.1249 13.3331 13.3563C13.3291 13.5878 13.2649 13.8142 13.1469 14.0133C13.0288 14.2124 12.8609 14.3774 12.6598 14.4919C12.4586 14.6065 12.2311 14.6667 11.9997 14.6666H3.99966C3.76818 14.6667 3.54067 14.6065 3.33952 14.4919C3.13837 14.3774 2.97051 14.2124 2.85245 14.0133C2.73439 13.8142 2.67021 13.5878 2.66621 13.3563C2.66222 13.1249 2.71855 12.8964 2.82966 12.6933L6.50299 5.97331C6.61025 5.77706 6.66642 5.55697 6.66632 5.33331V1.33331" stroke="#3AD693" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.30176 10H11.6978" stroke="#3AD693" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.66699 1.33331H10.3337" stroke="#3AD693" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

type SessionType = "anatomy" | "biochem" | "biology";

interface SessionItem {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: SessionType;
}

const SESSIONS: SessionItem[] = [
  {
    id: "anatomy",
    title: "Anatomy",
    time: "09:00 - 10:30",
    duration: "1H 30M",
    type: "anatomy",
  },
  {
    id: "biochem",
    title: "Biochem",
    time: "11:00 - 12:15",
    duration: "1H 15M",
    type: "biochem",
  },
  {
    id: "biology",
    title: "Biology",
    time: "01:00 - 02:00",
    duration: "1H 00M",
    type: "biology",
  },
];

interface SessionCardProps {
  item: SessionItem;
}

function SessionCard({ item }: SessionCardProps) {
  const xml = item.type === "biochem" ? BIOCHEM_SVG : ANATOMY_SVG;

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <View style={styles.anatomyImage}>
          <SvgXml xml={xml} />
        </View>
        <Text style={styles.hour}>{item.duration}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );
}

export default function SessionContainer() {
  const renderItem: ListRenderItem<SessionItem> = ({ item }) => (
    <SessionCard item={item} />
  );

  return (
    <FlatList
      data={SESSIONS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 24,
  },

  separator: {
    width: 12,
  },

  parentContainer: {
    backgroundColor: color.ratingBgColor,
    borderRadius: 20,
    boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.30)",
    borderWidth: 1,
    borderColor: "#31323D",
    width: 170,
    height: 124,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 17,
    paddingBottom: 12,
  },

  anatomyImage: {
    backgroundColor: "rgba(135, 122, 247, 0.18)",
    borderRadius: 16,
    padding: 10,
    height: 36,
    marginTop: 17,
  },

  hour: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: color.ratingText,
    fontFamily: "JetBrainsMono_400Regular",
    paddingTop: 27.5,
  },

  title: {
    color: "white",
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    lineHeight: 24,
    paddingLeft: 17,
  },

  time: {
    paddingLeft: 17,
    paddingTop: 2,
    fontFamily: "JetBrainsMono_400Regular",
    color: color.seeAll,
  },
});
