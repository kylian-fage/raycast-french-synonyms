import { SearchType } from "./types";
import WordList from "./components/WordList";

export default function Command() {
  return <WordList type={SearchType.SYNONYM} />;
}
