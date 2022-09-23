import { type FC, useState, useMemo } from 'react';
import { useCloudInit, useShare } from "@/hooks";
import { useHideHomeBtn } from "./hooks";
import Scene1 from "./components/scene-1";
import Scene2 from "./components/scene-2";
import Scene3 from "./components/scene-3";
import Scene4 from "./components/scene-4";
import Scene5 from "./components/scene-5";
import AcceptInvitation from "./components/accept-invitation";
import './index.less';

const sceneStack = [
  Scene1,
  Scene2,
  Scene3,
  Scene4,
  Scene5,
  AcceptInvitation,
]

export const Invitation: FC = () => {
  useShare();
  useCloudInit();
  useHideHomeBtn();
  const [idx, setIdx] = useState(0);

  const CurrentScene = useMemo(() => sceneStack[idx], [idx]);

  return (
    <>
      <CurrentScene
        onComplete={() => {
          idx !== (sceneStack.length - 1) && setIdx(idx + 1)
        }}
      />
    </>
  )
}

export default Invitation;
