import { type FC, useState, useMemo } from 'react';
import { useCloudInit, useShare } from "@/hooks";
import { useHideHomeBtn } from "./hooks";
import Scene1 from "./components/scene-1";
import Scene2 from "./components/scene-2";
import Scene3 from "./components/scene-3";
import Scene4 from "./components/scene-4";
import Scene5 from "./components/scene-5";
import AcceptInvitation from "./components/accept-invitation";
import BGM from "./components/bgm";
import './index.less';

const sceneStack = [
  AcceptInvitation,
  Scene1,
  Scene2,
  Scene3,
  Scene4,
  Scene5,
];

export const Invitation: FC = () => {
  useShare();
  useCloudInit();
  useHideHomeBtn();
  const [idx, setIdx] = useState(0);
  const [alreadyCompleteGame, setAlreadyCompleteGame] = useState(false);
  const CurrentScene = useMemo(() => sceneStack[idx], [idx]);

  return (
    <>
      <CurrentScene
        alreadyCompleteGame={alreadyCompleteGame}
        onComplete={() => {
          if (idx !== (sceneStack.length - 1)) {
            setIdx(idx + 1);
          } else {
            setIdx(0);
            setAlreadyCompleteGame(true);
          }
        }}
      />
      <BGM show={!idx} />
    </>
  )
}

export default Invitation;
