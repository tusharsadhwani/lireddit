import React from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import {
  useDownvoteMutation,
  useUpvoteMutation,
  useUpvoteStatusQuery,
} from "../generated/graphql";

export interface UpvoteDownvoteButtonProps {
  postId: number;
}

const UpvoteDownvoteButtons: React.FC<UpvoteDownvoteButtonProps> = ({
  postId,
}) => {
  const [{ data: upvoteData }] = useUpvoteStatusQuery({
    variables: { postId },
  });
  const [, upvote] = useUpvoteMutation();
  const [, downvote] = useDownvoteMutation();

  console.log(upvoteData);

  const upvoted = upvoteData?.upvoteStatus;
  const downvoted = upvoteData?.upvoteStatus === false;

  return (
    <div>
      <ImArrowUp
        size={18}
        color={upvoted ? "orange" : undefined}
        onClick={() => upvote({ postId })}
      />
      <ImArrowDown
        size={18}
        style={{ marginTop: 8 }}
        color={downvoted ? "rebeccapurple" : undefined}
        onClick={() => downvote({ postId })}
      />
    </div>
  );
};

export default UpvoteDownvoteButtons;
