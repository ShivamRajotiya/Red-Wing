import React, { useEffect, useState } from 'react';
import TeamWork from 'screens/TeamWork/TeamWork';
import styles from './BigDashboard.module.css';
import { TopStatistics } from './TopStatistics';
import ProjectsColumn from './ProjectsColumn';
import ActivitiesColumn from './ActivitiesColumn';
import moment from 'moment';
import axios from 'axios';
import './style.css';

import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import BelowTeamWork from './BelowTeamWork';

const BigDashboard = ({ selectedProject, setSelectedProject, timer }) => {
	useEffect(() => {
		getTeamWorkData();
		setInterval(async () => getTeamWorkData(), 120000);
	}, []);
	const [style, setStyle] = useState();
	const [isActive, setIsActive] = useState(false);
	const [isActive1, setIsActive1] = useState(false);
	const [isActive2, setIsActive2] = useState(false);

	const handleClick = () => {
		// setIsActive(current => !current);

		setIsActive(!isActive);
		// setIsActive1(!isActive1);
		// setStyle('max');
	};
	const handleClick1 = () => {
		// setIsActive(current => !c
		// setIsActive(!isActive);
		setIsActive1(!isActive1);
		// setStyle('max');
	};
	const handleClick2 = () => {
		// setIsActive(current => !c
		// setIsActive(!isActive);
		setIsActive2(!isActive2);
		// setStyle('max');
	}
	const [totalTickets, setTotalTickets] = useState(0);
	const [completedTask, setCompletedTask] = useState(0);
	const [sleepingTask, setSleepingTask] = useState(0);

	const localStorageData = localStorage.getItem('redwing_data');

	const [allusers, setAllUsers] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);

	const [data, setData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);
	const [projectData, setProjectData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData).projects : []
	);

	const scrollTop = () => {
		window.scrollTo({ top: 0, behaviour: 'smooth' });
	};

	useEffect(() => {
		if (allusers.users) {
			const teamMembers = allusers.users.filter(user => user.user_id !== 33629907);
			const totalTasks = teamMembers.reduce((acc, user) => {
				return acc + user.tasks_count;
			}, 0);
			if (totalTasks !== totalTickets) {
				setTotalTickets(totalTasks);
				setTopStatisticsCount(prev => {
					return {
						...prev,
						teamLoad: totalTasks
					};
				});
			}
		}
	}, [allusers]);

	useEffect(() => {
		if (allusers.users) {
			const teamMembers = allusers.users.filter(user => user.user_id !== 33629907);
			const totalCompleteTask = teamMembers.reduce((acc, user) => {
				return acc + user.completed_todo;
			}, 0);
			if (totalCompleteTask !== completedTask) {
				setCompletedTask(totalCompleteTask);
				setTopStatisticsCount(prev => {
					return {
						...prev,
						taskCompleted: completedTask
					};
				});
			}
		}
	}, [allusers]);

	const getTeamWorkData = () => {
		// setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
				headers: {
					// Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				// console.log(res.data);
				localStorage.setItem('redwing_data', JSON.stringify(res.data));
				setData(res.data);
				setAllUsers(res.data);
				setProjectData(res.data.projects);
				// setLoading(false);
			})
			.catch(error => {
				console.error(error);
				// setLoading(false);
			});
	};
	useEffect(() => {
		setTopStatisticsCount(() => {
			return {
				...topStatisticsCount,
				tasksToday: data.tickets_created_today
			};
		});
	}, [data]);

	const [topStatisticsCount, setTopStatisticsCount] = useState({
		hoursOfWeek: 0,
		completion: 0,
		worthOrders: '$0',
		tasksToday: data.tickets_created_today,
		teamLoad: totalTickets,
		taskCompleted: completedTask
	});
	useEffect(() => {
		// console.log(timer);
		setTopStatisticsCount(prev => {
			return {
				...prev,
				hoursOfWeek: timer.day,
				completion: moment().add(timer.day, 'hours').format('hh:mm')
			};
		});
	}, [timer]);
	return (
		<>
			<div className={styles.bigdashboard}>
				<Helmet>
					<meta name='apple-mobile-web-app-capable' content='yes' />
				</Helmet>
				<div
					// className={styles.teamWork}
					className={isActive ? styles.active : (isActive1 ? styles.active1 :(isActive2 ? styles.active1 : styles.teamWork))}
					// className={}
					// style={{
						// width: isActive ? '100%' : '50%'
						//   color: isActive ? 'white' : '',
					// }}
					// onClick={handleClick}
				>
					<div className={styles.outertopStatisticsBar}>
						<div className={styles.topStatisticsBarTeam}>
							{/* <div className={styles.topStatsContainer}> */}
							<TopStatistics text={'Tasks Today'} count={topStatisticsCount.tasksToday} />
							<TopStatistics text={'Team Load'} count={totalTickets} />
							<TopStatistics text={'Completions'} count={completedTask} />
							<div className='sleeping-text'>
								<TopStatistics
									text={'Sleeping'}
									count={
										<a
											href='https://redwing.puneetpugalia.com/pages/sleeping_task.php'
											target='_blank'
											style={{ color: 'white' }}
										>
											{data.sleeping_tasks}
										</a>
									}
								/>
							</div>
							{/* </div> */}
						</div>
						<div >
							<OpenInFullIcon
								className='full-icon'
								// style={{
									// width: isActive ? '150%' : '50%'
									//   color: isActive ? 'white' : '',
								// }}
								// className={style}
								onClick={handleClick}
							/>
						</div>
					</div>
					<div className={styles.alignTeamContent}>
						<TeamWork
							isInverted={false}
							screenIndex={2}
							showTeamTabTop={false}
							showTabComponent={false}
							showActionButtons={false}
						/>
					</div>
				</div>

				<div
				
						className={isActive ? styles.active1 : (isActive1 ? styles.active :(isActive2 ? styles.active1 : styles.Activity))}
					
					style={{
						display: topStatisticsCount.hoursOfWeek === 0 ? 'none' : ''
					}}
				>
					<div className={styles.outertopStatisticsBar}>
						<div className={styles.topStatisticsBar}>
							<TopStatistics text={'Hours of work'} count={topStatisticsCount.hoursOfWeek} />
							<TopStatistics text={'Completion'} count={topStatisticsCount.completion} />
						</div>
						<>
							<OpenInFullIcon className='full-icon-projects' onClick={handleClick1}/>
						</>
					</div>
					<div className={styles.alignActivitiesContent}>
						<ActivitiesColumn
							setTopStatisticsCount={setTopStatisticsCount}
							setSelectedProject={setSelectedProject}
							selectedProject={selectedProject}
						/>
					</div>
				</div>
				<div className={ isActive ? styles.active1  :(isActive1 ? styles.active1 :(isActive2 ? styles.active : styles.project))}>
					<div className={styles.outertopStatisticsBar}>
						<div className={styles.topStatisticsBar}>
							<TopStatistics text={'Worth Orders'} count={topStatisticsCount.worthOrders} />
						</div>
						<div>
							<OpenInFullIcon className='full-icon-projects'
								onClick={handleClick2}
								/>
						</div>
					</div>
					<div className={styles.alignProjectsContent}>
						<ProjectsColumn setTopStatisticsCount={setTopStatisticsCount} />
					</div>
				</div>
				{/* <div className='big-dashboard-footer' style={{ margin: '1rem' }}> */}
				{/* <Link to='/homepage' onClick={scrollTop}> */}
				{/* Go to Homepage */}
				{/* </Link> */}
				{/* </div> */}
			</div>
			<BelowTeamWork />-
			<div className='big-dashboard-footer' style={{ margin: '1rem' }}>
				<Link to='/homepage' onClick={scrollTop}>
					Go to Homepage
				</Link>
			</div>
		</>
	);
};
export default BigDashboard;

