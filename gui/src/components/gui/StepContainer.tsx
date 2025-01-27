import {
  ArrowUturnLeftIcon,
  BarsArrowDownIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ChatHistoryItem } from "core";
import { stripImages } from "core/llm/images";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  defaultBorderRadius,
  lightGray,
  vscBackground,
  vscInputBackground,
} from "..";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import useUIConfig from "../../hooks/useUIConfig";
import { RootState } from "../../redux/store";
import { getFontSize } from "../../util";
import HeaderButtonWithText from "../HeaderButtonWithText";
import { CopyButton } from "../markdown/CopyButton";
import StyledMarkdownPreview from "../markdown/StyledMarkdownPreview";

interface StepContainerProps {
  item: ChatHistoryItem;
  onReverse: () => void;
  onUserInput: (input: string) => void;
  onRetry: () => void;
  onContinueGeneration: () => void;
  onDelete: () => void;
  open: boolean;
  isFirst: boolean;
  isLast: boolean;
  index: number;
  subtext?: string;
}

// #region styled components

const ButtonsDiv = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
  background-color: ${vscBackground};
  box-shadow: 1px 1px 10px ${vscBackground};
  border-radius: ${defaultBorderRadius};
  z-index: 100;
  position: absolute;
  right: 8px;
  top: 16px;
  height: 0;
`;

const ContentDiv = styled.div<{ isUserInput: boolean; fontSize?: number }>`
  padding: 2px;
  padding-right: 0px;
  background-color: ${(props) =>
    props.isUserInput ? vscInputBackground : vscBackground};
  font-size: ${(props) => props.fontSize || getFontSize()}px;
  // border-radius: ${defaultBorderRadius};
  overflow: hidden;
`;

// #endregion

function StepContainer(props: StepContainerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUserInput = props.item.message.role === "user";
  const active = useSelector((store: RootState) => store.state.active);
  const ideMessenger = useContext(IdeMessengerContext);

  const [feedback, setFeedback] = useState<boolean | undefined>(undefined);

  const sessionId = useSelector((store: RootState) => store.state.sessionId);

  const sendFeedback = (feedback: boolean) => {
    setFeedback(feedback);
    if (props.item.promptLogs?.length) {
      for (const promptLog of props.item.promptLogs) {
        ideMessenger.post("devdata/log", {
          tableName: "chat",
          data: { ...promptLog, feedback, sessionId },
        });
      }
    }
  };

  const [truncatedEarly, setTruncatedEarly] = useState(false);

  const uiConfig = useUIConfig();

  useEffect(() => {
    if (!active) {
      const content = stripImages(props.item.message.content).trim();
      const endingPunctuation = [".", "?", "!", "```"];

      // If not ending in punctuation or emoji, we assume the response got truncated
      if (
        !(
          endingPunctuation.some((p) => content.endsWith(p)) ||
          /\p{Emoji}/u.test(content.slice(-2))
        )
      ) {
        setTruncatedEarly(true);
      } else {
        setTruncatedEarly(false);
      }
    }
  }, [props.item.message.content, active]);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="relative">
        <ContentDiv
          hidden={!props.open}
          isUserInput={isUserInput}
          fontSize={getFontSize()}
        >
          {uiConfig?.displayRawMarkdown ? (
            <pre
              className="whitespace-pre-wrap break-words p-4 max-w-full overflow-x-auto"
              style={{ fontSize: getFontSize() - 2 }}
            >
              {stripImages(props.item.message.content)}
            </pre>
          ) : (
            <StyledMarkdownPreview
              source={stripImages(props.item.message.content)}
              showCodeBorder={true}
            />
          )}
        </ContentDiv>
        {(isHovered || typeof feedback !== "undefined") && !active && (
          <div
            className="flex items-center justify-between absolute -bottom-2 w-full"
            style={{ zIndex: 200 }}
          >
            <div
              className="pl-2"
              style={{ color: lightGray, fontSize: getFontSize() - 3 }}
            >
              {props.subtext ?? ""}
            </div>
            <div className="flex items-center gap-2 pr-2">
              {truncatedEarly && (
                <HeaderButtonWithText
                  text="Continue generation"
                  onClick={(e) => {
                    props.onContinueGeneration();
                  }}
                >
                  <BarsArrowDownIcon
                    color={lightGray}
                    width="1.2em"
                    height="1.2em"
                  />
                </HeaderButtonWithText>
              )}

              <CopyButton
                text={stripImages(props.item.message.content)}
                color={lightGray}
              />
              <HeaderButtonWithText
                text="Regenerate"
                onClick={(e) => {
                  props.onRetry();
                }}
              >
                <ArrowUturnLeftIcon
                  color={lightGray}
                  width="1.2em"
                  height="1.2em"
                />
              </HeaderButtonWithText>
              {feedback === false || (
                <HeaderButtonWithText text="Helpful">
                  <HandThumbUpIcon
                    className={
                      "cursor-pointer hover:text-green-500" +
                      (feedback === true ? " text-green-500" : "")
                    }
                    width="1.2em"
                    height="1.2em"
                    color={lightGray}
                    onClick={() => {
                      sendFeedback(true);
                    }}
                  />
                </HeaderButtonWithText>
              )}
              {feedback === true || (
                <HeaderButtonWithText text="Unhelpful">
                  <HandThumbDownIcon
                    className={
                      "cursor-pointer hover:text-red-500" +
                      (feedback === false ? " text-red-500" : "")
                    }
                    width="1.2em"
                    height="1.2em"
                    color={lightGray}
                    onClick={() => {
                      sendFeedback(false);
                    }}
                  />
                </HeaderButtonWithText>
              )}
              <HeaderButtonWithText text="Delete Message">
                <TrashIcon
                  color={lightGray}
                  width="1.2em"
                  height="1.2em"
                  onClick={() => {
                    props.onDelete();
                  }}
                />
              </HeaderButtonWithText>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StepContainer;
