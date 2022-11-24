import React, { useContext, useState, useEffect, useCallback } from 'react';
import './Home.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { AllDataContext } from 'context/AllDataContext';
import { withThemeCreator } from '@material-ui/styles';
import { formControlClasses } from '@mui/material';
import useData from 'hooks/use-data';
import moment from 'moment';
import axios from 'axios';

import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary
}));

export default function Home() {
	const { globalState, setGlobalState } = useContext(AllDataContext);
	const { tasks, projectOrder } = globalState;
	const [red, setRed] = useState(0);
	const [yellow, setYellow] = useState(0);
	const [green, setGreen] = useState(0);
	const [white, setWhite] = useState(0);
	const allScreenData = useData();
	const localStorageData = localStorage.getItem('redwing_data');
	const [data, setData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);
	const [projectData, setProjectData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData).projects : []
	);
	//teamwork
	const getTeamWorkData = () => {
		// setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				setData(res.data);
				setProjectData(res.data.projects);
				localStorage.setItem('redwing_data', JSON.stringify(res.data));
			})
			.catch(error => {
				console.error(error);

			});
	};
	useEffect(() => {
		if (token && token !== 'undefined' && new Date(token_expiry_date) > new Date()) {
			getTeamWorkData();
		}
	}, []);
	// console.log(data);
	// console.log(data.tickets_created_today);
	// console.log(data.average);

	const token = localStorage.getItem('red_wing_token');
	const token_expiry_date = localStorage.getItem('red_wing_token_expiry_date');
	const [globalTime, setGlobalTIme] = useState(allScreenData);

	const calculateTimerForGlobe = useCallback(
		activities => {
			let t = {
				day: 0,
				evening: 0
			};
			globalTime.projectOrder.forEach(projectID => {
				const project = globalTime.tasks[projectID];
				project.activityList.forEach(a => {
					const activity = activities[a.id];
					if (a.isSelected) {
						if (project.isEveningTask) {
							t.evening += activity.time;
						} else if (activity.evening) {
							t.evening += activity.time;
						} else {
							t.day += activity.time;
						}
						//project.isEveningTask ? (t.evening += activity.time) : (t.day += activity.time);
					}
				});
			});
			return t;
		},
		[globalTime.projectOrder, globalTime.tasks]
	);

	const [timer, setTimer] = useState(() => calculateTimerForGlobe(globalTime.activities));

	useEffect(() => {
		setTimer(t => (t = calculateTimerForGlobe(globalTime.activities)));
		// console.log(timer);
	}, [calculateTimerForGlobe, globalTime.activities]);

	useEffect(() => {
		var len = projectOrder.length;
		var x = 1;
		var r = 0,
			w = 0,
			g = 0,
			y = 0;
		while (x <= len) {
			if (tasks['project-' + x].needsColor === 'Red') {
				// console.log('red');
				r++;
			} else if (tasks['project-' + x].needsColor === 'Yellow') {
				// console.log('yellow');

				y++;
			} else if (tasks['project-' + x].needsColor === 'green') {
				// console.log('green');

				g++;
			} else if (tasks['project-' + x].needsColor === 'white') {
				// console.log('white');

				w++;
			}
			x++;
		}
		// console.log(r + ' ' + g + ' ' + y + ' ' + w);
		// setRed(r);
		// setYellow(y);
		// setGreen(g);
		// setWhite(w);
	}, []);

	return (
		<div className='page'>
			<div className='xyz'>
				<Container sx={{ flexGrow: 1 }} sx={{ mt: -2 }}>
					<Grid container spacing={0.5} justifyContent='center'>
						<Grid item xs={12} sm={6} md={4} sx={{ m: 0 }}>
							<Link to='/drive' style={{ textDecoration: 'none' }}>
								<div className='homeCard'>
									<div className='homeCard-div1'>
										<svg
											width='26'
											height='22'
											viewBox='0 0 26 22'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M3.01029 16.6113C2.10714 16.6113 1.34082 17.3503 1.34082 18.2808C1.34082 19.184 2.07977 19.9503 3.01029 19.9503C3.91345 19.9503 4.67977 19.2113 4.67977 18.2808C4.67977 17.3503 3.94082 16.6113 3.01029 16.6113ZM3.01029 19.2113C2.49029 19.2113 2.0524 18.7734 2.0524 18.2534C2.0524 17.7334 2.49029 17.2955 3.01029 17.2955C3.53029 17.2955 3.96819 17.7334 3.96819 18.2534C3.96819 18.8008 3.55766 19.2113 3.01029 19.2113Z'
												fill='#969BA5'
											/>
											<path
												d='M8.42924 9.30371C7.52608 9.30371 6.75977 10.0427 6.75977 10.9732C6.75977 11.8763 7.49871 12.6427 8.42924 12.6427C9.3324 12.6427 10.0987 11.9037 10.0987 10.9732C10.0713 10.07 9.3324 9.30371 8.42924 9.30371ZM8.42924 11.9311C7.90924 11.9311 7.47134 11.4932 7.47134 10.9732C7.47134 10.4532 7.90924 10.0153 8.42924 10.0153C8.94924 10.0153 9.38713 10.4532 9.38713 10.9732C9.38713 11.4932 8.94924 11.9311 8.42924 11.9311Z'
												fill='#969BA5'
											/>
											<path
												d='M16.5581 8.9209C15.655 8.9209 14.8887 9.65985 14.8887 10.5904C14.8887 11.4935 15.6276 12.2598 16.5581 12.2598C17.4613 12.2598 18.2276 11.5209 18.2276 10.5904C18.2002 9.65985 17.4613 8.9209 16.5581 8.9209ZM16.5581 11.5209C16.0381 11.5209 15.6003 11.083 15.6003 10.563C15.6003 10.043 16.0381 9.60511 16.5581 9.60511C17.0781 9.60511 17.516 10.043 17.516 10.563C17.4887 11.1104 17.0781 11.5209 16.5581 11.5209Z'
												fill='#969BA5'
											/>
											<path
												d='M22.88 0.62793C21.1832 0.62793 19.8147 1.99635 19.8147 3.69319C19.8147 4.45951 20.1158 5.17109 20.5811 5.71846L18.3916 8.15425C17.8716 7.77109 17.2421 7.52477 16.5579 7.52477C14.9432 7.52477 13.6295 8.78372 13.52 10.3711H11.44C11.1663 8.9753 9.90737 7.9353 8.45684 7.9353C6.76 7.9353 5.39158 9.30372 5.39158 11.0006C5.39158 11.8764 5.74737 12.6427 6.34947 13.2174L4.57053 15.6532C4.13263 15.4069 3.61263 15.2427 3.06526 15.2427C1.36842 15.2427 0 16.6111 0 18.3079C0 20.0048 1.36842 21.3732 3.06526 21.3732C4.7621 21.3732 6.13053 20.0048 6.13053 18.3079C6.13053 17.4321 5.74737 16.6385 5.14526 16.0637L6.92421 13.6279C7.38947 13.9016 7.90947 14.0385 8.45684 14.0385C10.0989 14.0385 11.4674 12.7248 11.5221 11.0827H13.5747C13.8211 12.5332 15.08 13.6553 16.5853 13.6553C18.2821 13.6553 19.6505 12.2869 19.6505 10.59C19.6505 9.85109 19.3768 9.16688 18.9663 8.64688L21.1832 6.18372C21.6758 6.53951 22.2779 6.73109 22.9347 6.73109C24.6316 6.73109 26 5.36267 26 3.66582C25.9179 1.99635 24.5495 0.62793 22.88 0.62793ZM5.36421 18.2532C5.36421 19.5395 4.32421 20.6069 3.01053 20.6069C1.72421 20.6069 0.656842 19.5669 0.656842 18.2532C0.656842 16.9669 1.69684 15.8995 3.01053 15.8995C4.32421 15.9269 5.36421 16.9669 5.36421 18.2532ZM8.42947 13.3269C7.14316 13.3269 6.07579 12.2869 6.07579 10.9732C6.07579 9.68688 7.11579 8.61951 8.42947 8.61951C9.71579 8.61951 10.7832 9.65951 10.7832 10.9732C10.7832 12.2595 9.71579 13.3269 8.42947 13.3269ZM16.5579 12.9164C15.2716 12.9164 14.2042 11.8764 14.2042 10.5627C14.2042 9.27635 15.2442 8.20898 16.5579 8.20898C17.8442 8.20898 18.9116 9.24898 18.9116 10.5627C18.8842 11.8764 17.8442 12.9164 16.5579 12.9164ZM22.88 6.01951C21.5937 6.01951 20.5263 4.97951 20.5263 3.66582C20.5263 2.37951 21.5663 1.31214 22.88 1.31214C24.1663 1.31214 25.2337 2.35214 25.2337 3.66582C25.2063 4.97951 24.1663 6.01951 22.88 6.01951Z'
												fill='#969BA5'
											/>
											<path
												d='M22.8804 2.02344C21.9773 2.02344 21.2109 2.76239 21.2109 3.69291C21.2109 4.59607 21.9499 5.36239 22.8804 5.36239C23.7836 5.36239 24.5499 4.62344 24.5499 3.69291C24.5225 2.76239 23.7836 2.02344 22.8804 2.02344ZM22.8804 4.62344C22.3604 4.62344 21.9225 4.18554 21.9225 3.66554C21.9225 3.14554 22.3604 2.70765 22.8804 2.70765C23.4004 2.70765 23.8383 3.14554 23.8383 3.66554C23.8109 4.21291 23.4004 4.62344 22.8804 4.62344Z'
												fill='#969BA5'
											/>
										</svg>
									</div>
									<div className='homeCard-div2'>
										<h5 className='homeCard-heading'>Drive</h5>
										<div className='project-need'>
											<div className='need-square red-square'></div>
											<div className='numbers'>{red}</div>
											<div className='need-square yellow-square'></div>
											<div className='numbers'> {yellow}</div>
											<div className='need-square green-square'></div>
											<div className='numbers'>{green} </div>
											<div className='need-square white-square'></div>
											<div className='numbers'>{white} </div>
										</div>
									</div>
								</div>
							</Link>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Link to='/rapid-estimation' style={{ textDecoration: 'none' }}>
								<div className='homeCard'>
									<div className='homeCard-div1'>
										<svg
											width='26'
											height='26'
											viewBox='0 0 26 26'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M25.9499 14.2511C25.7164 11.805 24.6674 9.49891 22.996 7.75763C21.5676 6.26964 19.8193 5.31342 17.9796 4.88825V3.5441C18.731 3.34936 19.2895 2.64084 19.2895 1.79869C19.2895 0.806869 18.515 0 17.5629 0H13.9066C12.9545 0 12.18 0.806869 12.18 1.79869C12.18 2.64079 12.7385 3.34931 13.4898 3.5441V4.892C11.6558 5.31898 9.91331 6.27387 8.48898 7.75768C8.17728 8.08239 7.88985 8.42303 7.62675 8.77706C7.61401 8.77605 7.60126 8.77505 7.58826 8.77505H3.96948C3.68906 8.77505 3.46166 9.01189 3.46166 9.30407C3.46166 9.59625 3.68906 9.8331 3.96948 9.8331H6.93576C6.56343 10.4825 6.2632 11.1644 6.03468 11.8665H0.50782C0.227402 11.8665 0 12.1033 0 12.3955C0 12.6877 0.227402 12.9245 0.50782 12.9245H5.74771C5.60136 13.5938 5.51737 14.2749 5.49568 14.9579H3.25005C2.96963 14.9579 2.74223 15.1948 2.74223 15.4869C2.74223 15.7791 2.96963 16.016 3.25005 16.016H5.51188C5.55474 16.7007 5.66042 17.3819 5.82897 18.0494H2.5391C2.25868 18.0494 2.03128 18.2862 2.03128 18.5784C2.03128 18.8706 2.25868 19.1074 2.5391 19.1074H6.15306C6.65123 20.4803 7.42977 21.7671 8.48898 22.8705C10.162 24.6134 12.378 25.7065 14.7285 25.9484C15.0639 25.9829 15.3997 26 15.7349 26C17.7165 26 19.673 25.4026 21.333 24.2764C21.568 24.1169 21.6345 23.7892 21.4815 23.5444C21.3284 23.2995 21.0138 23.2303 20.7788 23.3897C17.145 25.8548 12.2784 25.3218 9.20714 22.1224C5.60355 18.3683 5.60355 12.26 9.20714 8.50588C12.8107 4.75186 18.6741 4.75186 22.2778 8.50588C25.345 11.7012 25.8594 16.7667 23.5009 20.5504C23.3482 20.7954 23.415 21.1231 23.6502 21.2822C23.8855 21.4413 24.2 21.3716 24.3527 21.1266C25.6128 19.1049 26.18 16.6632 25.9499 14.2511ZM13.1957 1.79874C13.1957 1.39033 13.5146 1.0581 13.9066 1.0581H17.5629C17.955 1.0581 18.2739 1.39033 18.2739 1.79874C18.2739 2.20715 17.955 2.53937 17.5629 2.53937H17.4718H13.9977H13.9066C13.5146 2.53937 13.1957 2.20709 13.1957 1.79874ZM14.5055 4.71012V3.59742H16.964V4.70822C16.1476 4.60707 15.3217 4.6077 14.5055 4.71012Z'
												fill='#969BA5'
											/>
											<path
												d='M22.6377 21.9668C22.5036 21.9668 22.3731 22.0234 22.2787 22.1218C22.1838 22.2202 22.1299 22.3567 22.1299 22.4958C22.1299 22.6349 22.1838 22.7714 22.2787 22.8698C22.3731 22.9688 22.5037 23.0248 22.6377 23.0248C22.7713 23.0248 22.9018 22.9688 22.9967 22.8698C23.0912 22.7714 23.1455 22.6349 23.1455 22.4958C23.1455 22.3567 23.0912 22.2202 22.9967 22.1218C22.9018 22.0234 22.7712 21.9668 22.6377 21.9668Z'
												fill='#969BA5'
											/>
											<path
												d='M15.743 7.10742C11.3992 7.10742 7.86523 10.7889 7.86523 15.3141C7.86523 19.8394 11.3992 23.5209 15.743 23.5209C20.0868 23.5209 23.6208 19.8394 23.6208 15.3141C23.6208 10.7889 20.0868 7.10742 15.743 7.10742ZM15.743 22.4628C11.9592 22.4628 8.88088 19.2559 8.88088 15.3141C8.88088 11.3724 11.9592 8.16547 15.743 8.16547C19.5268 8.16547 22.6051 11.3724 22.6051 15.3141C22.6051 19.2559 19.5268 22.4628 15.743 22.4628Z'
												fill='#969BA5'
											/>
											<path
												d='M18.9546 11.2194L16.4394 13.8396C16.2291 13.7313 15.9925 13.6701 15.7424 13.6701C15.4922 13.6701 15.2557 13.7313 15.0454 13.8396L13.9197 12.6669C13.7213 12.4603 13.3999 12.4603 13.2015 12.6669C13.0032 12.8735 13.0032 13.2085 13.2015 13.4151L14.3271 14.5878C14.2231 14.8069 14.1644 15.0534 14.1644 15.3139C14.1644 16.2203 14.8722 16.9578 15.7424 16.9578C16.6125 16.9578 17.3204 16.2203 17.3204 15.3139C17.3204 15.0534 17.2616 14.8069 17.1576 14.5878L19.599 12.0444L19.6728 11.9675C19.8711 11.761 19.8711 11.426 19.6728 11.2194C19.4745 11.0128 19.153 11.0128 18.9546 11.2194ZM15.7424 15.8998C15.4323 15.8998 15.18 15.637 15.18 15.3139C15.18 14.9909 15.4323 14.7281 15.7424 14.7281C16.0525 14.7281 16.3047 14.9909 16.3047 15.3139C16.3047 15.637 16.0525 15.8998 15.7424 15.8998Z'
												fill='#969BA5'
											/>
											<path
												d='M21.1726 12.4014H20.7021C20.4217 12.4014 20.1943 12.6382 20.1943 12.9304C20.1943 13.2226 20.4217 13.4594 20.7021 13.4594H21.1726C21.4531 13.4594 21.6805 13.2226 21.6805 12.9304C21.6805 12.6382 21.4531 12.4014 21.1726 12.4014Z'
												fill='#969BA5'
											/>
											<path
												d='M10.7829 12.3896H10.3125C10.0321 12.3896 9.80469 12.6265 9.80469 12.9187C9.80469 13.2108 10.0321 13.4477 10.3125 13.4477H10.7829C11.0634 13.4477 11.2907 13.2108 11.2907 12.9187C11.2907 12.6265 11.0634 12.3896 10.7829 12.3896Z'
												fill='#969BA5'
											/>
											<path
												d='M15.748 8.28737C16.0285 8.28737 16.2559 8.05053 16.2559 7.75836V7.26827C16.2559 6.9761 16.0285 6.73926 15.748 6.73926C15.4676 6.73926 15.2402 6.9761 15.2402 7.26827V7.75836C15.2402 8.05053 15.4676 8.28737 15.748 8.28737Z'
												fill='#969BA5'
											/>
											<path
												d='M15.7363 19.9521C15.4559 19.9521 15.2285 20.189 15.2285 20.4812V20.9712C15.2285 21.2634 15.4559 21.5003 15.7363 21.5003C16.0167 21.5003 16.2441 21.2634 16.2441 20.9712V20.4812C16.2441 20.189 16.0167 19.9521 15.7363 19.9521Z'
												fill='#969BA5'
											/>
											<path
												d='M0.507812 18.0488C0.374258 18.0488 0.243242 18.1054 0.148789 18.2038C0.0543359 18.3022 0 18.4387 0 18.5778C0 18.7175 0.0542852 18.8535 0.148789 18.9519C0.243293 19.0503 0.374258 19.1069 0.507812 19.1069C0.641367 19.1069 0.772383 19.0503 0.866785 18.9519C0.961238 18.8535 1.01562 18.717 1.01562 18.5778C1.01562 18.4387 0.961289 18.3022 0.866785 18.2038C0.772383 18.1054 0.641367 18.0488 0.507812 18.0488Z'
												fill='#969BA5'
											/>
										</svg>
									</div>
									<div className='homeCard-div2'>
										<h5 className='homeCard-heading'>Esitmates</h5>
										<div className='project-need'>
											{timer.day ? (
												<p>
													<span>{timer.day}</span> Hours of work
												</p>
											) : (
												<p>
													<span>{timer.evening}</span> hours of evening work.
												</p>
											)}
										</div>
									</div>
								</div>
							</Link>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Link to='/team-work' style={{ textDecoration: 'none' }}>
								<div className='homeCard'>
									<div className='homeCard-div1'>
										<svg
											width='26'
											height='26'
											viewBox='0 0 26 26'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M12.9548 3.30383C13.2372 3.30383 13.4662 3.07486 13.4662 2.79241V0.511418C13.4662 0.228973 13.2372 0 12.9548 0C12.6723 0 12.4434 0.228973 12.4434 0.511418V2.79241C12.4434 3.07486 12.6724 3.30383 12.9548 3.30383Z'
												fill='#969BA5'
											/>
											<path
												d='M25.4561 17.5696L24.5527 16.6687C24.2313 16.3477 23.8029 16.1709 23.3465 16.1709C23.0547 16.1709 22.7745 16.2435 22.5263 16.3795L20.8238 14.6791L20.9067 14.5962C21.5974 13.9042 21.5971 12.7796 20.9066 12.0899C20.6599 11.8427 20.352 11.6779 20.0164 11.6085C20.0626 11.449 20.0869 11.2819 20.0869 11.111C20.0869 10.6359 19.9024 10.1905 19.5683 9.85778C19.3215 9.61058 19.0137 9.44574 18.6781 9.37638C18.7243 9.21687 18.7486 9.04985 18.7486 8.87882C18.7486 8.40371 18.5641 7.95831 18.2295 7.62513C17.9768 7.37275 17.6662 7.21299 17.34 7.145C17.5145 6.54339 17.3654 5.86653 16.8921 5.39243C16.4982 5.00015 15.9636 4.83155 15.4484 4.8862L12.0748 4.24762C11.5602 4.15002 10.9177 4.08548 10.5121 4.45542C10.4865 4.47878 10.4604 4.50564 10.4347 4.53555C9.80585 4.30632 9.07237 4.44282 8.56877 4.94586C8.23468 5.27955 8.05065 5.7248 8.05065 6.1996C8.05065 6.37063 8.07487 6.53765 8.12103 6.69721C7.78577 6.76652 7.47829 6.93116 7.23236 7.17755C6.89761 7.51093 6.71302 7.95567 6.71266 8.42991C6.71251 8.60135 6.73684 8.76893 6.78325 8.92889C6.44784 8.99806 6.14016 9.16238 5.89346 9.40877C5.55871 9.74317 5.37437 10.1887 5.37437 10.6632C5.37437 11.0267 5.48289 11.373 5.68399 11.6655C5.43008 11.7516 5.1975 11.8948 5.00276 12.0894C4.31163 12.7796 4.31137 13.9042 5.00321 14.5973L5.08584 14.6796L3.38314 16.3792C2.75036 16.0812 1.97071 16.1928 1.44853 16.7144L0.54452 17.6158C0.222973 17.937 0.0459492 18.3654 0.0458984 18.822C0.0458984 19.2788 0.222973 19.7072 0.54452 20.0284L1.67273 21.1552C1.87255 21.3549 2.19638 21.3547 2.39595 21.1548C2.59557 20.955 2.59537 20.6312 2.39555 20.4316L1.26734 19.3048C1.13927 19.1769 1.06873 19.0054 1.06873 18.8221C1.06873 18.6388 1.13927 18.4674 1.26704 18.3398L2.17109 17.4383C2.39697 17.2127 2.74269 17.1791 3.00523 17.336C3.02371 17.3638 3.04509 17.3902 3.06957 17.4147C3.11339 17.4587 3.16341 17.4923 3.21653 17.517L8.40094 22.6938C8.42557 22.7474 8.45939 22.798 8.50352 22.8421C8.54648 22.8852 8.59548 22.9184 8.64748 22.9429C8.75712 23.0669 8.8177 23.2252 8.8177 23.3941C8.8177 23.5774 8.74716 23.7488 8.61909 23.8767L7.71595 24.7788C7.44909 25.0445 7.01502 25.0444 6.74897 24.7796L5.62077 23.6513C5.42104 23.4516 5.09726 23.4516 4.89754 23.6513C4.69782 23.851 4.69782 24.1748 4.89754 24.3745L6.02656 25.5036C6.35887 25.8346 6.79529 26 7.2319 26C7.66862 26 8.10554 25.8343 8.43826 25.5031L9.34196 24.6004C9.66351 24.2793 9.84059 23.8509 9.84059 23.3941C9.84059 23.0681 9.74994 22.7568 9.5814 22.4884L11.4977 20.5745C11.4997 20.5724 11.5017 20.5703 11.5038 20.5682C11.7232 20.3414 12.3343 20.3838 12.9252 20.4249C13.3451 20.4541 13.8132 20.4865 14.2705 20.4338L16.369 22.5298C16.2331 22.7777 16.1605 23.0575 16.1605 23.3488C16.1605 23.8051 16.3376 24.2332 16.6591 24.5544L17.5629 25.4571C17.8842 25.7781 18.3126 25.9549 18.769 25.9549C19.2254 25.9549 19.6537 25.7781 19.9751 25.4571L25.4565 19.9823C25.778 19.6612 25.9551 19.2328 25.9551 18.7761C25.955 18.3194 25.778 17.891 25.4561 17.5696ZM11.8843 5.25258L14.1028 5.67249L12.7749 6.99986C12.5695 6.90115 12.288 6.71701 11.9791 6.42157C11.5564 6.01715 11.254 5.55021 11.2265 5.25898C11.2264 5.25883 11.2264 5.25868 11.2264 5.25852C11.2264 5.25847 11.2264 5.25842 11.2264 5.25837C11.2244 5.23745 11.2239 5.22074 11.2241 5.208C11.291 5.19175 11.4686 5.17372 11.8843 5.25258ZM9.29154 5.66955C9.55063 5.41072 9.95312 5.38086 10.2459 5.57911C10.4118 6.27471 11.0052 6.90516 11.2721 7.16059C11.47 7.3499 12.1048 7.91748 12.7455 8.07348C12.8322 8.19774 12.8794 8.34587 12.8794 8.50218C12.8794 8.70352 12.8019 8.89177 12.6608 9.03274C12.5201 9.17371 12.3316 9.2513 12.1299 9.2513C11.9281 9.2513 11.7396 9.17371 11.5982 9.03208L11.5981 9.03203L11.5979 9.03177L9.29149 6.72956C9.15088 6.58915 9.07343 6.4009 9.07343 6.1996C9.07348 5.99825 9.15093 5.81001 9.29154 5.66955ZM7.95518 7.90123C8.09589 7.76031 8.28424 7.68267 8.48564 7.68267C8.68729 7.68267 8.87625 7.76047 9.01788 7.90194L10.8751 9.75541C11.1675 10.0483 11.1675 10.5249 10.8761 10.8168C10.7346 10.9578 10.5454 11.0353 10.3433 11.0353C10.1413 11.0353 9.95205 10.9578 9.81118 10.8174L9.81113 10.8174L8.40221 9.40877C8.40002 9.40659 8.39764 9.40456 8.3954 9.40233L7.95462 8.96175C7.8132 8.82047 7.73535 8.63187 7.7355 8.43068C7.7357 8.23014 7.8133 8.0425 7.95518 7.90123ZM6.61628 10.1325C6.7571 9.99185 6.94585 9.9144 7.14786 9.9144C7.34819 9.9144 7.53532 9.99073 7.67553 10.1289L9.08877 11.5415C9.22969 11.6818 9.30733 11.8699 9.30733 12.071C9.30733 12.272 9.22969 12.4601 9.08821 12.601C8.94744 12.7415 8.75889 12.819 8.55724 12.819C8.35529 12.819 8.16613 12.7413 8.02516 12.601L7.51282 12.0893C7.51272 12.0891 7.51257 12.089 7.51247 12.0889L6.61633 11.1938C6.47506 11.0527 6.39726 10.8642 6.39726 10.6631C6.39726 10.4621 6.47506 10.2735 6.61628 10.1325ZM5.72558 12.813C5.867 12.6717 6.05601 12.5939 6.25777 12.5939C6.45947 12.5939 6.64843 12.6717 6.7898 12.8128L7.30284 13.3253C7.44381 13.4656 7.52141 13.6537 7.52141 13.8548C7.52141 14.0559 7.44376 14.2439 7.30178 14.3853C7.16106 14.5263 6.97251 14.6039 6.77081 14.6039C6.56905 14.6039 6.3805 14.5263 6.23877 14.3843L6.17454 14.3203C6.17367 14.3195 6.17301 14.3186 6.1722 14.3177C6.17123 14.3168 6.17022 14.316 6.16925 14.3151L5.72609 13.8737C5.43364 13.5806 5.43338 13.1048 5.72558 12.813ZM16.1476 18.6253C15.948 18.4254 15.6242 18.4253 15.4244 18.6249L14.9694 19.0793C14.537 19.5117 13.7536 19.4572 12.996 19.4047C12.1733 19.3475 11.3226 19.2885 10.7721 19.8537L8.88834 21.7351L4.17772 17.0314L5.84476 15.3673C6.1203 15.5362 6.43824 15.6268 6.77091 15.6268C7.24617 15.6268 7.69183 15.4426 8.0247 15.1091C8.35981 14.7753 8.54439 14.3299 8.54439 13.8548C8.54439 13.8504 8.54409 13.846 8.54409 13.8416C8.54851 13.8417 8.55293 13.8419 8.55734 13.8419C9.03195 13.8419 9.47725 13.6583 9.81057 13.3253C10.1457 12.9916 10.3303 12.5461 10.3303 12.0711C10.3303 12.0667 10.33 12.0623 10.33 12.0579C10.3344 12.0579 10.3389 12.0582 10.3434 12.0582C10.8179 12.0582 11.2634 11.8747 11.599 11.5405C11.9473 11.1916 12.1196 10.7322 12.1163 10.2738C12.1209 10.2739 12.1255 10.2741 12.1301 10.2741C12.6053 10.2741 13.0509 10.0899 13.3843 9.75591C13.7184 9.42223 13.9024 8.97698 13.9024 8.50218C13.9024 8.17012 13.8121 7.85268 13.6438 7.5777L15.1049 6.11718C15.2138 6.00877 15.3481 5.94072 15.4888 5.91264C15.504 5.91101 15.519 5.90857 15.5339 5.90563C15.7597 5.8745 15.9968 5.94417 16.1695 6.11612C16.4619 6.40907 16.4619 6.88571 16.1705 7.1776L15.7255 7.62077C15.724 7.62224 15.7225 7.62356 15.721 7.62503L15.2085 8.1367C15.0086 8.33627 15.0084 8.66011 15.208 8.85993C15.4077 9.05981 15.7315 9.05996 15.9312 8.86039L16.378 8.41422C16.3781 8.41412 16.3782 8.41402 16.3783 8.41392L16.4459 8.34663C16.7391 8.05606 17.2142 8.05667 17.5072 8.34922C17.6482 8.48958 17.7258 8.67763 17.7258 8.87872C17.7258 9.07976 17.6482 9.26781 17.5061 9.40928L17.0585 9.85773C17.0585 9.85778 17.0584 9.85783 17.0584 9.85793L16.5459 10.3683C16.3458 10.5677 16.3451 10.8915 16.5444 11.0916C16.7437 11.2917 17.0675 11.2923 17.2676 11.093L17.7825 10.5803C17.9232 10.4393 18.1117 10.3617 18.3134 10.3617C18.5152 10.3617 18.7038 10.4393 18.8455 10.5813C18.9865 10.7217 19.0641 10.9098 19.0641 11.1109C19.0641 11.3119 18.9865 11.4999 18.8447 11.6411L17.9525 12.5337C17.7528 12.7335 17.7529 13.0573 17.9526 13.2569C18.0525 13.3568 18.1833 13.4066 18.3141 13.4066C18.4451 13.4066 18.576 13.3567 18.6758 13.2568L19.1131 12.8193C19.1156 12.817 19.1183 12.8149 19.1208 12.8124C19.2615 12.6714 19.45 12.5938 19.6517 12.5938C19.8535 12.5938 20.042 12.6714 20.1833 12.8129C20.4754 13.1047 20.4751 13.5806 20.1833 13.873L19.7387 14.317C19.7385 14.3172 19.7383 14.3173 19.7382 14.3175C19.738 14.3176 19.7379 14.3179 19.7377 14.318L19.032 15.0228C18.8322 15.2224 18.832 15.5462 19.0316 15.7461C19.1315 15.8461 19.2625 15.8961 19.3935 15.8961C19.5242 15.8961 19.655 15.8462 19.7549 15.7465L20.1 15.4018L21.7543 17.0541L17.0441 21.7586L15.3564 20.073C15.4741 19.9973 15.5867 19.9084 15.6924 19.8027L16.1471 19.3485C16.347 19.149 16.3472 18.8251 16.1476 18.6253ZM24.7336 19.2587L19.2522 24.7334C19.124 24.8615 18.9524 24.932 18.7689 24.932C18.5855 24.932 18.4139 24.8615 18.2856 24.7333L17.3819 23.8307C17.2538 23.7028 17.1833 23.5317 17.1833 23.3488C17.1833 23.166 17.2538 22.9949 17.3819 22.867L22.8632 17.3922C22.9915 17.2641 23.1631 17.1936 23.3466 17.1936C23.53 17.1936 23.7016 17.2641 23.8302 17.3926L24.7337 18.2935C24.8617 18.4214 24.9323 18.5927 24.9323 18.776C24.9322 18.9594 24.8617 19.1308 24.7336 19.2587Z'
												fill='#969BA5'
											/>
											<path
												d='M6.16313 2.87296C6.26297 2.97259 6.39368 3.02235 6.52439 3.02235C6.65541 3.02235 6.78647 2.97228 6.88636 2.87219C7.08588 2.67227 7.08557 2.34849 6.88565 2.14897L5.02208 0.289104C4.8222 0.0895847 4.49837 0.0898386 4.29885 0.289815C4.09933 0.489741 4.09964 0.813522 4.29956 1.01304L6.16313 2.87296Z'
												fill='#969BA5'
											/>
											<path
												d='M19.3845 3.02234C19.5152 3.02234 19.646 2.97247 19.7459 2.87278L21.608 1.01287C21.8078 0.8133 21.808 0.489468 21.6084 0.289644C21.4089 0.0898194 21.0851 0.0896163 20.8852 0.289237L19.023 2.14915C18.8232 2.34872 18.823 2.67255 19.0226 2.87238C19.1225 2.97237 19.2535 3.02234 19.3845 3.02234Z'
												fill='#969BA5'
											/>
											<path
												d='M3.19066 21.9986C2.99266 22.2 2.9954 22.5238 3.19685 22.7218L3.19833 22.7232C3.2977 22.821 3.42674 22.8696 3.55572 22.8696C3.68811 22.8696 3.8205 22.8184 3.92079 22.7163C4.11879 22.5149 4.11528 22.1904 3.91388 21.9924C3.71254 21.7944 3.38876 21.7972 3.19066 21.9986Z'
												fill='#969BA5'
											/>
											<path
												d='M17.3975 17.8884C17.4753 17.8884 17.5542 17.8707 17.6283 17.8334C17.8805 17.7062 17.9818 17.3987 17.8546 17.1465C17.7274 16.8943 17.4198 16.7929 17.1677 16.9201L17.1649 16.9216C16.9127 17.0488 16.8128 17.3556 16.9399 17.6078C17.0297 17.7859 17.2103 17.8884 17.3975 17.8884Z'
												fill='#969BA5'
											/>
										</svg>
									</div>
									<div className='homeCard-div2'>
										<h5 className='homeCard-heading'>Team Work</h5>
										<div className='project-need'>
											<p>
												<span>{data.tickets_created_today}</span> Tasks Delegated Today
											</p>
										</div>
									</div>
								</div>
							</Link>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Link to='/team-work' style={{ textDecoration: 'none' }}>
								<div className='homeCard'>
									<div className='homeCard-div1'>
										<svg
											width='26'
											height='26'
											viewBox='0 0 26 26'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<g clip-path='url(#clip0)'>
												<path
													d='M21.6834 0H4.31641C2.6924 0 1.37109 1.3213 1.37109 2.94531V21.7342C1.37109 22.5742 2.05446 23.2576 2.89453 23.2576H9.56374C9.84422 23.2576 10.0715 23.0303 10.0715 22.7498C10.0715 22.4693 9.84422 22.242 9.56374 22.242H2.89453C2.61444 22.242 2.38672 22.0143 2.38672 21.7342V2.94531C2.38672 1.88129 3.25238 1.01562 4.31641 1.01562H19.4611C19.0114 1.53296 18.7381 2.2076 18.7381 2.94531V19.3104C18.7381 19.7789 18.357 20.16 17.8885 20.16C17.5223 20.16 17.1984 19.9265 17.0823 19.5791L16.317 17.2829C16.101 16.6346 15.4966 16.1992 14.8134 16.1992C13.9395 16.1992 13.2285 16.9102 13.2285 17.784V18.1795H10.5964C10.3159 18.1795 10.0886 18.407 10.0886 18.6873C10.0886 18.9678 10.3159 19.1951 10.5964 19.1951H13.2285V21.7215C13.2285 22.4713 13.3747 23.2025 13.6631 23.8944L14.4102 25.6874C14.4915 25.8824 14.6801 26 14.8791 26C14.9442 26 15.0104 25.9875 15.0741 25.9609C15.3332 25.853 15.4556 25.5557 15.3476 25.2968L14.6006 23.5038C14.3642 22.9363 14.2441 22.3366 14.2441 21.7217V17.7841C14.2441 17.4701 14.4994 17.2148 14.8134 17.2148C15.0588 17.2148 15.276 17.3712 15.3536 17.604L16.1189 19.9003C16.3732 20.663 17.0843 21.1756 17.8885 21.1756C18.917 21.1756 19.7537 20.3389 19.7537 19.3104V10.604L20.4323 11.2812C21.6431 12.4896 22.3098 14.0974 22.3098 15.8078V21.2059C22.3098 22.6042 21.993 24.011 21.394 25.2744C21.2738 25.5277 21.3819 25.8306 21.6352 25.9508C21.8885 26.071 22.1914 25.9631 22.3116 25.7096C22.9747 24.3111 23.3255 22.7538 23.3255 21.2059V15.8078C23.3255 13.8256 22.5528 11.9628 21.1498 10.5623L19.7537 9.16879V8.68359H23.1053C23.9453 8.68359 24.6287 8.00023 24.6287 7.16016V2.94531C24.6287 1.3213 23.3076 0 21.6834 0V0ZM23.6131 7.16016C23.6131 7.44005 23.3854 7.66797 23.1053 7.66797H19.7537V2.94531C19.7537 1.88129 20.6194 1.01562 21.6834 1.01562C22.7474 1.01562 23.6131 1.88129 23.6131 2.94531V7.16016Z'
													fill='#969BA5'
												/>
												<path
													d='M11.7812 22.2422C11.6476 22.2422 11.5166 22.2965 11.4222 22.391C11.3278 22.4856 11.2734 22.6165 11.2734 22.75C11.2734 22.8837 11.3278 23.0146 11.4222 23.109C11.5166 23.2035 11.6476 23.2578 11.7812 23.2578C11.9147 23.2578 12.0457 23.2035 12.1403 23.109C12.2347 23.0146 12.2891 22.8837 12.2891 22.75C12.2891 22.6165 12.2347 22.4856 12.1403 22.391C12.0457 22.2965 11.9147 22.2422 11.7812 22.2422Z'
													fill='#969BA5'
												/>
												<path
													d='M8.3623 3.75781C8.3623 3.19783 7.90666 2.74219 7.34668 2.74219H5.1123C4.55212 2.74219 4.09668 3.19783 4.09668 3.75781V5.99219C4.09668 6.55217 4.55212 7.00781 5.1123 7.00781H7.34668C7.90666 7.00781 8.3623 6.55217 8.3623 5.99219V3.75781ZM7.34668 5.99219H5.1123V3.75781H7.34668L7.34727 5.99219C7.34727 5.99219 7.34707 5.99219 7.34668 5.99219Z'
													fill='#969BA5'
												/>
												<path
													d='M8.3623 9.85156C8.3623 9.29158 7.90666 8.83594 7.34668 8.83594H5.1123C4.55212 8.83594 4.09668 9.29158 4.09668 9.85156V12.0859C4.09668 12.6459 4.55212 13.1016 5.1123 13.1016H7.34668C7.90666 13.1016 8.3623 12.6459 8.3623 12.0859V9.85156ZM7.34668 12.0859H5.1123V9.85156H7.34668L7.34727 12.0859C7.34727 12.0859 7.34707 12.0859 7.34668 12.0859Z'
													fill='#969BA5'
												/>
												<path
													d='M7.34668 14.9297H5.1123C4.55212 14.9297 4.09668 15.3851 4.09668 15.9453V18.1795C4.09668 18.7397 4.55212 19.1951 5.1123 19.1951H7.34668C7.90666 19.1951 8.3623 18.7397 8.3623 18.1795V15.9453C8.3623 15.3851 7.90666 14.9297 7.34668 14.9297ZM7.34668 18.1795H5.1123V15.9453H7.34668L7.34727 18.1795C7.34727 18.1795 7.34707 18.1795 7.34668 18.1795Z'
													fill='#969BA5'
												/>
												<path
													d='M16.4187 7.00781C16.6992 7.00781 16.9265 6.78049 16.9265 6.5C16.9265 6.21951 16.6992 5.99219 16.4187 5.99219H12.918C12.6375 5.99219 12.4102 6.21951 12.4102 6.5C12.4102 6.78049 12.6375 7.00781 12.918 7.00781H16.4187Z'
													fill='#969BA5'
												/>
												<path
													d='M10.5967 7.00781C10.7304 7.00781 10.8613 6.95346 10.9557 6.85904C11.0501 6.76462 11.1045 6.6335 11.1045 6.5C11.1045 6.3665 11.0501 6.23538 10.9557 6.14096C10.8613 6.04654 10.7304 5.99219 10.5967 5.99219C10.4626 5.99219 10.3321 6.04654 10.2376 6.14096C10.1428 6.23538 10.0889 6.3665 10.0889 6.5C10.0889 6.6335 10.1428 6.76462 10.2376 6.85904C10.3321 6.95346 10.4626 7.00781 10.5967 7.00781Z'
													fill='#969BA5'
												/>
												<path
													d='M10.5967 13.1016H16.4197C16.7001 13.1016 16.9275 12.8742 16.9275 12.5938C16.9275 12.3133 16.7001 12.0859 16.4197 12.0859H10.5967C10.3164 12.0859 10.0889 12.3133 10.0889 12.5938C10.0889 12.8742 10.3164 13.1016 10.5967 13.1016Z'
													fill='#969BA5'
												/>
											</g>
											<defs>
												<clipPath id='clip0'>
													<rect width='26' height='26' fill='white' />
												</clipPath>
											</defs>
										</svg>
									</div>
									<div className='homeCard-div2'>
										<h5 className='homeCard-heading'>Avegrage Task</h5>
										<div className='project-need'>
											<p>
												<span>{data.average}</span>{' '}
											</p>
										</div>
									</div>
								</div>
							</Link>
						</Grid>
					</Grid>
				</Container>
			</div>
		</div>
	);
}
