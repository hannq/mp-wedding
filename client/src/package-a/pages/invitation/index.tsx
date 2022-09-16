import { type FC, useState, useMemo } from 'react';
import { useCloudInit, useShare } from "@/hooks";
import { useHideHomeBtn } from "./hooks";
import Scene1 from "./components/scene-1";
import AcceptInvitation from "./components/accept-invitation";
import './index.less';

const sceneStack = [
  Scene1,
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
