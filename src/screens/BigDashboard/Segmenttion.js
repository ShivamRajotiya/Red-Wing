import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TeamWork from 'screens/TeamWork/TeamWork';
import TeamWork2 from '../TeamWork/TeamWork2';
import styles from './BigDashboard.module.css';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	};
}

export default function BasicTabs() {
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	let data = JSON.parse(localStorage.getItem('redwing_data'));
	let users = [];
	let projects = [];
	data.projects.map(project => {
		projects.push(project);
	});
	data.users.map(user => {
		users.push(user);
	});
	// console.log(projects);

	let cliSize = [];
	let redwingSize = [];
	data.users.map(ele =>
		!ele.project_ids.includes(23190856) ? cliSize.push(ele.project_ids) : ' '
	);
	data.users.map(ele => (ele.project_ids === 23190856 ? redwingSize.push(ele.project_ids) : ' '));
	let idle_st = [];

	let multiTask = [];
	let projectList = [];
	data.users.map(ele => (ele.project_ids.length >= 2 ? multiTask.push(ele.name) : ''));
	data.projects.map(project => (project.open_task_count > 0 ? projectList.push(project.name) : ''));
	console.log(multiTask, 'mt');
	console.log(projectList, 'pl');
	data.users.map(user => {
		if (user?.avatar !== '' && user?.tasks_count === 0) {
			idle_st.push(user.name.split(' ')[0]);
		}
	});
	return (
		<Box sx={{ width: '100%' }} style={{ color: 'white' }}>
			{/* console.log(multiTask, 'mt'); */}
			<Box
				sx={{ borderBottom: 1, borderColor: 'divider', color: 'white' }}
				style={{ color: 'white' }}
			>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label='basic tabs example'
					style={{ color: 'white' }}
				>
					<Tab label='Default' {...a11yProps(0)} style={{ color: 'white' }} />
					<Tab label='Playground' {...a11yProps(1)} style={{ color: 'white' }} />
					<Tab label='Project' {...a11yProps(2)} style={{ color: 'white' }} />
					<Tab label='Performance' {...a11yProps(3)} style={{ color: 'white' }} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				{/* <TeamWork2/> */}
				<div className={styles.alignTeamContent}>
					<TeamWork
						isInverted={false}
						screenIndex={2}
						showTeamTabTop={false}
						showTabComponent={false}
						showActionButtons={false}
						tabSection='default'
					/>
				</div>
				{/* </div> */}
			</TabPanel>
			<TabPanel value={value} index={1} style={{ height: '100vh' }}>
				{/* <h2>Client project</h2> */}

				<TeamWork
					isInverted={false}
					screenIndex={2}
					showTeamTabTop={false}
					showTabComponent={false}
					showActionButtons={false}
					clientProject={false}
					tabSection='playGround'
				/>
				{/* <TeamWork2/> */}
				{/* <div className={styles.alignTeamContent}> */}
				{/* <table> */}
				{/* <thead> */}
				{/* <td>{cliSize.length} Team Members</td> */}
				{/* <td>Activity</td> */}
				{/* <td>Tasks</td> */}
				{/* <td>Projects</td> */}
				{/* </thead> */}

				{/* <tbody> */}
				{/* {data.users.map(ele => */}
				{/* // !ele.project_ids.includes(23190856) ? ( */}
				{/* // <tr> */}
				{/* <td>{ele.name.split(' ')[0]}</td> */}
				{/* <td>{ele.completed_todo}</td> */}
				{/* <td>{ele.tasks_count}</td> */}
				{/* <td>{ele.project_ids.length}</td> */}
				{/* </tr> */}
				{/* // ) : ( */}
				{/* // ' ' */}
				{/* // ) */}
				{/* // )} */}
				{/* </tbody> */}
				{/* </table> */}
				{/* </div> */}

				{/* <h1>Redwing Projects</h1> */}
				{/* <div className={styles.alignTeamContent}> */}
				{/* <TeamWork2/> */}
				{/* <table> */}
				{/* <thead> */}
				{/* <td>{redwingSize.length} Team Members</td> */}
				{/* <td>Activity</td> */}
				{/* <td>Tasks</td> */}
				{/* <td>Projects</td> */}
				{/* </thead> */}

				{/* <tbody> */}
				{/* {data.users.map(ele => */}
				{/* // ele.project_ids === 23190856 ? ( */}
				{/* // <tr> */}
				{/* <td>{ele.name.split(' ')[0]}</td> */}
				{/* <td>{ele.completed_todo}</td> */}
				{/* <td>{ele.tasks_count}</td> */}
				{/* <td>{ele.project_ids.length}</td> */}
				{/* </tr> */}
				{/* // ) : ( */}
				{/* // ' ' */}
				{/* // ) */}
				{/* // )} */}
				{/* </tbody> */}
				{/* </table> */}
				{/* </div> */}
			</TabPanel>
			<TabPanel value={value} index={2} style={{ height: '100vh' }}>
				{/* <TabPanel value={value} index={1} style={{ height: '100vh' }}> */}
				{/* <h1>Multi Tasking Table</h1> */}
				{/* <TeamWork2/> */}
				{/* <div className={styles.alignTeamContent}> */}
				{/* <table> */}
				{/* <thead> */}
				{/* <td>{multiTask.length} Team Members</td> */}
				{/* <td>Activity</td> */}
				{/* <td>Tasks</td> */}
				{/* <td>Projects</td> */}
				{/* </thead> */}
				{/* <tbody> */}
				{/* {data.users.map(ele => */}
				{/* ele.project_ids.length > 1 ? ( */}
				{/* <tr> */}
				{/* <td>{ele.name.split(' ')[0]}</td> */}
				{/* <td>{ele.completed_todo}</td> */}
				{/* <td>{ele.tasks_count}</td> */}
				{/* <td>{ele.project_ids.length}</td> */}
				{/* </tr> */}
				{/* ) : ( */}
				{/* ' ' */}
				{/* ) */}
				{/* )} */}
				{/* </tbody> */}
				{/* </table> */}
				{/* </div> */}
				{/* <h1>All Projects</h1> */}
				{/* <div className={styles.alignTeamContent}> */}
				{/* <TeamWork2/> */}
				{/* <table> */}
				{/* <thead> */}
				{/* <td>{projectList.length} Projects</td> */}
				{/* <td>Activity</td> */}
				{/* <td>Tasks</td> */}
				{/* <td>Team Members</td> */}
				{/* </thead> */}
				{/* <tbody> */}
				{/* data.projects.map(project => projectList.push(project.name)); */}

				{/* {data.projects.map(project => */}
				{/* // project.name && project.open_task_count > 0 ? ( */}
				{/* // <tr> */}
				{/* <td>{project.name}</td> */}
				{/* <td>{project.name.split(' ')[0]}</td> */}
				{/* <td>{}</td> */}
				{/* <td>{ele.completed_todo}</td> */}
				{/* <td>{ele.tasks_count}</td> */}
				{/* <td>{ele.project_ids.length}</td> */}
				{/* </tr> */}
				{/* // ) : ( */}
				{/* // ' ' */}
				{/* // ) */}
				{/* // )} */}
				{/* </tbody> */}
				{/* </table> */}
				{/* // </div> */}
				{/* // <h1>Idle Tabel</h1> */}
				{/* // <div className={styles.alignTeamContent}> */}
				{/* <TeamWork2/> */}
				{/* <table> */}
				{/* <thead> */}
				{/* <td>{idle_st.length} Idle Members</td> */}
				{/* <td>Activity</td> */}
				{/* <td>Tasks</td> */}
				{/* <td>Projects</td> */}
				{/* </thead> */}
				{/* <tbody> */}
				{/* {data.users.map(ele => */}
				{/* // ele?.tasks_count === 0 ? ( */}
				{/* // <tr> */}
				{/* <td>{ele.name.split(' ')[0]}</td> */}
				{/* <td>{ele.completed_todo}</td> */}
				{/* <td>{ele.tasks_count}</td> */}
				{/* <td>{ele.project_ids.length}</td> */}
				{/* </tr> */}
				{/* ) : ( */}
				{/* ' ' */}
				{/* ) */}
				{/* )} */}
				{/* </tbody> */}
				{/* </table> */}
				{/* </div> */}
				{/* </TabPanel> */}

				<TeamWork
					isInverted={false}
					screenIndex={2}
					showTeamTabTop={false}
					showTabComponent={false}
					showActionButtons={false}
					clientProject={false}
					tabSection='project-seg'
				/>
			</TabPanel>
			<TabPanel value={value} index={3} style={{ height: '100vh' }}>
			<TeamWork
	isInverted={false}
	screenIndex={2}
	showTeamTabTop={false}
	showTabComponent={false}
	showActionButtons={false}
	clientProject={false}
	tabSection='performance-seg'
/>
			</TabPanel>
		</Box>
	);
}
