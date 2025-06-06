import { Link } from "react-router";
import { GetLanguageFlags } from "./GetLanguageFlags";


const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilepic} alt={friend.fullname} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullname}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {GetLanguageFlags(friend.nativelanguage)}
            Native: {friend.nativelanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {GetLanguageFlags(friend.learninglanguage)}
            Learning: {friend.learninglanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;