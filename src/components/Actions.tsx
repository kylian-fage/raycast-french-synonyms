import { Action, ActionPanel, Icon, LaunchType, launchCommand } from "@raycast/api";
import WordList from "./WordList";
import { SearchType } from "../types";

export default function Actions(props: { word: string; search: string; type: SearchType }) {
  const baseUrl: string = "https://crisco4.unicaen.fr/des/synonymes/";
  const url: string = encodeURI(baseUrl + props.search);
  const reverseType = props.type === SearchType.SYNONYM ? SearchType.ANTONYM : SearchType.SYNONYM;
  const reverseCommand = `${reverseType}s`;

  const pasteAction = <Action.Paste content={props.word} />;
  const copyAction = <Action.CopyToClipboard content={props.word} />;
  const openInBrowserAction = <Action.OpenInBrowser url={url} shortcut={{ modifiers: ["cmd"], key: "o" }} />;

  const seeReverse = (
    <Action.Push
      title={`Chercher des ${reverseType}s`}
      icon={Icon.BulletPoints}
      shortcut={{ modifiers: ["cmd", "shift"], key: "n" }}
      target={<WordList type={reverseType} search={props.word} />}
    />
  );

  const seeOther = (
    <Action.Push
      title={`Chercher des ${props.type}s`}
      icon={Icon.BulletPoints}
      shortcut={{ modifiers: ["cmd"], key: "n" }}
      target={<WordList type={props.type} search={props.word} />}
    />
  );

  return (
    <ActionPanel>
      {pasteAction}
      {copyAction}
      {seeOther}
      {seeReverse}
      {openInBrowserAction}
    </ActionPanel>
  );
}
