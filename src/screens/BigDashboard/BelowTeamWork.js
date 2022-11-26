import React, { useState } from 'react';
import './style.css';

const BelowTeamWork = () => {
	const [absent, setAbsent] = useState(["Person D, "  , "Person E "]);
	const [slowdown, setSlowdown] = useState(['Person A ,' , 'Person B, ' , 'Person C   ']);
	const [idle, setIdle] = useState(['Person F ,' , ' Person G']);
	return (
		<>
			<div className='below-team-work'>
				<div className='slowdown'> {slowdown.length}   Slowdowns : {slowdown}</div> 
                <div className='absent'> {absent.length}   Absent : {absent}</div>
				<div className='idle'> {idle.length}   Idles : {idle}</div>
			</div>
		</>
	);
};

export default BelowTeamWork;
