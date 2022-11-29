import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import './style.css';

const BelowTeamWork = props => {
	const [absent, setAbsent] = useState(0);
	const [slowdown, setSlowdown] = useState(0);
	const [idle, setIdle] = useState(0);
	const [names, setName] = useState();
	let data = JSON.parse(localStorage.getItem('redwing_data'));
	console.log('DATA', data);
	useEffect(() => {
		data.users.map(user => {
			if (user?.avatar !== '' && user?.name.split(' ')[0] !== 'Kajal') {
				user?.active_todo_count === 0
					? setAbsent(prev => prev + 1)
					: moment().diff(moment(user?.last_active_at), 'hours') >= 3 &&
					  setSlowdown(prev => prev + 1);
			}
			user?.tasks_count === 0 && setIdle(prev => prev + 1);
			// && user?.projects.tasks_count === 0
			// setNames(user.name

			// console.log(user.name);
			// setAbsent(user.name)
		});
		// return (unsub)=>{
		// /unsub();
		// }
	}, []);

	let absent_st = [];
	let slowdown_st = [];
	let idle_st = [];
	data.users.map(user => {
		if (
			user.active_todo_count === 0 &&
			user?.avatar !== '' &&
			user?.name.split(' ')[0] !== 'Kajal'
		) {
			absent_st.push(user.name.split(' ')[0]);
		}
	});

	data.users.map(user => {
		if (
			moment().diff(moment(user?.last_active_at), 'hours') >= 3 &&
			user?.avatar !== '' &&
			user?.name.split(' ')[0] !== 'Kajal'
		) {
			slowdown_st.push(user.name.split(' ')[0]);
		}
	});

	data.users.map(user => {
		if (
			user?.avatar !== '' &&
			user?.tasks_count === 0
			// user?.name.split(' ')[0] !== 'Kajal' &&
			// moment().diff(moment(user?.last_active_at), 'hours') < 3
		) {
			idle_st.push(user.name.split(' ')[0]);
		}
	});
	// idle_st.push('Kajal');

	console.log('ABSENT', absent_st);
	console.log('🚀🚀', names);

	// console.log('Shivsm🚀🚀', absent, slowdown, idle);
	// console.log("Data",JSON.parse(localStorage.getItem('redwing_data').users));

	return (
		<>
			<div
				className='below-team-work'
				// style={{
				// 	color:
				// 		props.active_todo === 0
				// 			? // 1-1 === 0
				// 			  'red'
				// 			: moment().diff(moment(props.last_active_at), 'hours') >= 3
				// 			? '#EDFC45'
				// 			: 'white'
				// 	// paddingLeft: '2rem',
				// 	// fontSize: '14px'
				// }}
			>
				<div className='absent'>
					{/* {' '} */}
					{absent} Absent :{' '}
					{absent_st.map(idx => (
						<span>{idx + ' , '}</span>
					))}
				</div>
				<div className='slowdown'>
					{' '}
					{slowdown} Slowdowns :{' '}
					{slowdown_st.map(idx => (
						<span>{idx + ' , '}</span>
					))}
				</div>

				<div className='idle'>
					{' '}
					{idle} Idles :{' '}
					{idle_st.map(idx => (
						<span>{idx + ' , '}</span>
					))}
				</div>
			</div>
			{/* <p>user=</p> */}
		</>
	);
};

export default BelowTeamWork;
