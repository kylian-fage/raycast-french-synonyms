import { useCallback, useEffect, useState } from "react";
import { List, getSelectedText } from "@raycast/api";
import searchWords from "../api";
import Actions from "./Actions";
import { SearchType } from "../types";

export default function WordList(props: { type: SearchType; search?: string }) {
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const typeText = props.type.charAt(0).toUpperCase() + props.type.slice(1) + "s";
  const placeholder = `${typeText} de...`;

  useEffect(() => {
    if (search || props.search) {
      return;
    }

    const setSelectedText = async () => {
      let selectedText = "";
      try {
        selectedText = await getSelectedText();
      } catch (error) {
        return;
      }

      if (!selectedText) {
        return;
      }

      onSearch(selectedText);
    };

    setSelectedText();
  }, []);

  const onSearch = useCallback((search: string) => {
    setLoading(true);
    searchWords(search, props.type).then((words) => {
      setWords(words);
      setLoading(false);
      setSearch(search);
    });
  }, []);

  if (props.search) {
    useEffect(() => {
      setLoading(true);
      searchWords(props.search!, props.type).then((words) => {
        setWords(words);
        setLoading(false);
        setSearch(props.search!);
      });
    }, []);
  }

  return (
    <List
      navigationTitle={search ? `${typeText} de ${search}` : `${typeText} (DÉS)`}
      searchBarPlaceholder={placeholder}
      isLoading={loading}
      throttle={true}
      onSearchTextChange={onSearch}
    >
      {words.length === 0 ? (
        <List.EmptyView
          title={placeholder}
          description={search ? `Aucun ${props.type} de « ${search} » trouvé dans le DÉS` : undefined}
          icon="zipper-icon.png"
        />
      ) : (
        words.map((word) => (
          <List.Item key={word} title={word} actions={<Actions word={word} search={search} type={props.type} />} />
        ))
      )}
    </List>
  );
}
