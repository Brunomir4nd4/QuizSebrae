'use client';

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	Dispatch,
	SetStateAction,
} from 'react';
import { ClassResponse } from '@/types/IClass';
import { Appointment } from '@/types/IAppointment';
import { useSession } from 'next-auth/react';
import { ThemeSettings } from '@/types/IThemeSettings';
import { remapClassesData } from '@/hooks';
import { setClassIdOnLocalStorage } from '@/hooks/setClassId';

interface UserContextProps {
	classId: string | null;
	error: {
		title: string;
		message: string;
		logout: boolean;
	} | null;
	classesData: { [key: string]: ClassResponse['data'][0] } | null;
	scheduleData: number;
	themeSettings: ThemeSettings | null;
	userAppointments:
		| {
				[x: number]: Appointment;
		  }
		| null
		| undefined;
	coursesShowed: boolean;
	courseLoading: boolean;
	setClassId: Dispatch<SetStateAction<string | null>>;
	setScheduleData: Dispatch<SetStateAction<number>>;
	setError: React.Dispatch<
		React.SetStateAction<{
			title: string;
			message: string;
			logout: boolean;
		} | null>
	>;
	setUserAppointments: React.Dispatch<{
		[x: number]: Appointment;
	} | null>;
	setClassesData: React.Dispatch<
		React.SetStateAction<{ [key: string]: ClassResponse['data'][0] } | null>
	>;
	setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings | null>>;
	setCoursesShowed: Dispatch<SetStateAction<boolean>>;
	setCourseLoading: Dispatch<SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextProps>({
	classId: null,
	error: null,
	scheduleData: 0,
	classesData: null,
	userAppointments: null,
	coursesShowed: false,
	courseLoading: false,
	themeSettings: null,
	setError: () => {},
	setClassId: () => {},
	setClassesData: () => {},
	setScheduleData: () => {},
	setThemeSettings: () => {},
	setUserAppointments: () => {},
	setCoursesShowed: () => {},
	setCourseLoading: () => {},
});

export function useUserContext(): UserContextProps {
	return useContext(UserContext);
}

export default function UserProvider({
	children,
	classData,
}: {
	children: React.ReactNode;
	classData: ClassResponse['data'];
}) {
	const { data: classesDataRemaped } = remapClassesData(classData);
	const [classesData, setClassesData] = useState<{
		[key: string]: ClassResponse['data'][0];
	} | null>(classesDataRemaped);
	const [classId, setClassId] = useState<string | null>(null);
	const [scheduleData, setScheduleData] = useState<number>(0);
	const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(
		null,
	);
	const [userAppointments, setUserAppointments] = useState<{
		[x: number]: Appointment;
	} | null>(null);
	const [error, setError] = useState<null | {
		title: string;
		message: string;
		logout: boolean;
		reload?: boolean;
		whats?: boolean;
	}>(null);
	const session = useSession();
	const [coursesShowed, setCoursesShowed] = useState(false);
	const [courseLoading, setCourseLoading] = useState(false);

	useEffect(() => {
		const { data: remapped } = remapClassesData(classData);
		setClassesData(remapped);
	}, [classData]);

	useEffect(() => {
		setClassIdOnLocalStorage(classData, setClassId);
	}, [session]);

	return (
		<UserContext.Provider
			value={{
				classId,
				error,
				classesData,
				scheduleData,
				userAppointments,
				coursesShowed,
				courseLoading,
				themeSettings,
				setClassesData,
				setClassId,
				setError,
				setScheduleData,
				setUserAppointments,
				setCoursesShowed,
				setCourseLoading,
				setThemeSettings,
			}}>
			{children}
		</UserContext.Provider>
	);
}
