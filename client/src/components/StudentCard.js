import React from "react";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import FollowButton from "./FollowButton";

const StudentCard = ({ student }) => {
	const progressPercentage =
		student?.fee_amount > 0
			? (student.amount_raised / student.fee_amount) * 100
			: 0;
	const truncatedStory =
		student?.story && student.story.length > 150
			? student.story.substring(0, 150) + "..."
			: student?.story || "No story available";

	return (
		<div className="student-card">
			<div className="student-image">
				<img src={student.profile_image} alt={student.full_name} />
				<div className="verified-badge">✓ Verified</div>
			</div>
			<div className="student-info">
				<h3>{student.full_name}</h3>
				<p className="academic-info">
					{student.academic_level} • {student.school_name}
				</p>
				<p className="story">{truncatedStory}</p>
				<div className="funding-info">
					<ProgressBar percentage={progressPercentage} />
					<div className="amounts">
						<span>KSh {student.amount_raised.toLocaleString()}</span>
						<span>of KSh {student.fee_amount.toLocaleString()}</span>
					</div>
				</div>
				<div className="card-actions">
					<Link to={`/campaign/${student.id}`} className="support-btn">
						Support {student.full_name.split(" ")[0]}
					</Link>
					<FollowButton
						studentId={student.id}
						initialFollowing={student.is_following}
					/>
				</div>
			</div>
		</div>
	);
};

export default StudentCard;
