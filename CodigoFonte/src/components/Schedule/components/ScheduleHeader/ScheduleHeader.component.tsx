'use client'

import { useEffect, type FunctionComponent, useState, useRef } from 'react';

import { ScheduleCalendarView } from '../../utils/ScheduleCalendarView';
import { ScheduleHeaderProps } from './ScheduleHeader.interface';
import { DayButton, Header, HeaderContent } from './ScheduleHeader.styles';
import { DayHeader, DayHeading, DayNavigation, WeekHeader, WeekHeading, WeekNavigation } from './components';
import { Class } from '@/components/Class';
import { Divider } from '@mui/material';
import { DateTime } from 'luxon';
const locale = 'pt-BR';
/**
 * **ScheduleHeader**
 *
 * ### 🧩 Funcionalidade
 * - Cabeçalho do calendário, alterna diário/semanal.
 * - Gerencia navegação, seleção de datas, troca de turma.
 * - Sticky header com resize observer.
 * - Mostra WeekHeading/DayHeading e navegação.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <ScheduleHeader
 *   type={ScheduleCalendarView.Week}
 *   date={currentDate}
 *   weekStart={weekStart}
 *   weekEnd={weekEnd}
 *   setDate={setDate}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - HeaderContent e Header sticky.
 * - Class para mobile/desktop.
 * - ResizeObserver para width/left.
 *
 * @component
 */
export const ScheduleHeader: FunctionComponent<ScheduleHeaderProps> = (
    { type, date, weekStart, weekEnd, setDate }: ScheduleHeaderProps
) => {
    const weekDays = 7;
    const [isSticky, setIsSticky] = useState(false);
    const [headerWidth, setHeaderWidth] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [headerStickyLeft, setHeaderStickyLeft] = useState(0);
    const headerContentRef = useRef<HTMLDivElement>(null);
    const headerSpacerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const headerTop = headerContentRef.current?.offsetHeight || 0;
            const shouldBeSticky = window.scrollY > headerTop;

            if (headerTop > 0 && shouldBeSticky !== isSticky) {
                setIsSticky(shouldBeSticky);
            }
        };

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const _width = entry.contentRect.width;
                const _left = entry.target.getBoundingClientRect().left;

                setHeaderWidth(_width);
                setHeaderStickyLeft(_left);
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);

        const _width = headerRef.current?.offsetWidth || 0;
        const _height = headerRef.current?.offsetHeight || 0;
        const _left = headerRef.current?.offsetLeft || 0;

        setHeaderWidth(_width);
        setHeaderHeight(_height);

        if (!isSticky) {
            setHeaderStickyLeft(_left);
        }

        window.addEventListener('scroll', handleScroll);

        handleScroll();

        if (headerRef.current) {
            resizeObserver.observe(headerRef.current);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, [isSticky]);

    return (
        <header className='flex w-full flex-col'>
            <HeaderContent ref={headerContentRef}>
                <div className='block w-[100%] md:hidden'>
                    <Class href="/trocar-turma" buttonText="Trocar" />
                    <Divider sx={{margin: '30px 0'}} />
                </div>
                {type === ScheduleCalendarView.Day
                    ? DayHeading(date)
                    : WeekHeading(date)}

                <div className='hidden md:flex'>
                    <DayButton className="group" onClick={() => setDate(DateTime.fromJSDate(new Date()).setLocale(locale))}>
                        <span className='text-xl text-black-light'>Hoje</span>
                    </DayButton>
                </div>

                {type === ScheduleCalendarView.Day
                    ? DayNavigation(weekStart, weekEnd, () => {
                        setDate(date.minus({ days: weekDays }));
                    }, () => {
                        setDate(date.plus({ days: weekDays }));
                    })
                    : WeekNavigation(weekStart, weekEnd, () => {
                        setDate(date.minus({ days: weekDays }));
                    }, () => {
                        setDate(date.plus({ days: weekDays }));
                    })}
                <div className='hidden md:flex md:w-[465px]'>
                    <Class small href="/trocar-turma" buttonText="Trocar" />
                </div>
            </HeaderContent>
            <div ref={headerSpacerRef} style={{
                height: isSticky ? headerHeight : 0
            }} />
            <Header
                ref={headerRef}
                className={isSticky ? 'sticky' : ''}
                style={{
                    width: isSticky ? headerWidth : 'auto',
                    left: isSticky ? `${headerStickyLeft}px` : 0,
                }}>
                {type === ScheduleCalendarView.Day
                    ? DayHeader(weekStart, weekEnd)
                    : WeekHeader(weekStart, weekEnd)}
            </Header>
        </header>
    );
};