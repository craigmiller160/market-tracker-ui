import { useMemo } from 'react';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';
import {
    MarketTime,
    marketTimeToMenuKey,
    menuKeyToMarketTime
} from '../../types/MarketTime';
import { identity, pipe } from 'fp-ts/function';
import { type MenuProps } from 'antd';
import { type ItemType } from 'antd/es/menu/hooks/useItems';
import { match } from 'ts-pattern';
import { Try } from '@craigmiller160/ts-functions';
import * as Either from 'fp-ts/Either';
import { BreakpointName, useBreakpointName } from '../utils/Breakpoints';
import * as Option from 'fp-ts/Option';
import * as RArray from 'fp-ts/ReadonlyArray';
import { CaretDownOutlined } from '@ant-design/icons';

interface NavbarItem {
    readonly key: string;
    readonly name: string;
}

interface AllItems {
    readonly pages: ReadonlyArray<NavbarItem>;
    readonly times: ReadonlyArray<NavbarItem>;
}

const ITEMS: AllItems = {
    pages: [
        {
            key: 'page.investments',
            name: 'Investment Info'
        },
        {
            key: 'page.search',
            name: 'Search'
        },
        {
            key: 'page.recognition',
            name: 'Recognition'
        }
    ],
    times: [
        {
            key: marketTimeToMenuKey(MarketTime.ONE_DAY),
            name: 'Today'
        },
        {
            key: marketTimeToMenuKey(MarketTime.ONE_WEEK),
            name: '1 Week'
        },
        {
            key: marketTimeToMenuKey(MarketTime.ONE_MONTH),
            name: '1 Month'
        },
        {
            key: marketTimeToMenuKey(MarketTime.THREE_MONTHS),
            name: '3 Months'
        },
        {
            key: marketTimeToMenuKey(MarketTime.ONE_YEAR),
            name: '1 Year'
        },
        {
            key: marketTimeToMenuKey(MarketTime.FIVE_YEARS),
            name: '5 Years'
        }
    ]
};

const createAuthNavItem = (
    isAuthorized: boolean,
    authBtnAction: () => void,
    authBtnTxt: string
): NonNullable<MenuProps['items']> => {
    const className = ['AuthItem', isAuthorized ? 'IsAuth' : null]
        .filter(identity)
        .join(' ');
    return [
        {
            className,
            key: 'auth.action',
            onClick: authBtnAction,
            label: authBtnTxt
        }
    ];
};

const isOneDayItem = (item: NavbarItem): boolean =>
    pipe(
        Try.tryCatch(() => menuKeyToMarketTime(item.key)),
        Either.map((time) => time === MarketTime.ONE_DAY),
        Either.getOrElse((): boolean => false)
    );

const navbarItemToMenuItem = (item: NavbarItem): ItemType => {
    const className = match(item)
        .when(isOneDayItem, () => 'OneDayItem')
        .otherwise(() => '');

    return {
        label: item.name,
        className,
        key: item.key
    };
};

type NavbarItemComponents = [
    PageItems: NonNullable<MenuProps['items']>,
    TimeItems: NonNullable<MenuProps['items']>
];

const useDesktopItems = (): NavbarItemComponents => [
    ITEMS.pages.map(navbarItemToMenuItem),
    ITEMS.times.map(navbarItemToMenuItem)
];

const getItemName = (
    items: ReadonlyArray<NavbarItem>,
    selected: string
): string =>
    pipe(
        items,
        RArray.findFirst((item) => item.key === selected),
        Option.map((item) => item.name),
        Option.getOrElse(() => '')
    );

const createMobileItemMenu = (
    title: string,
    items: ReadonlyArray<NavbarItem>
): NonNullable<MenuProps['items']> => [
    {
        label: title,
        key: title,
        children: items.map(navbarItemToMenuItem),
        icon: <CaretDownOutlined />
    }
];

const useMobileItems = (
    selectedPageKey: string,
    selectedTimeKey: string
): NavbarItemComponents => {
    const pageName = useMemo(
        () => getItemName(ITEMS.pages, selectedPageKey),
        [selectedPageKey]
    );
    const timeName = useMemo(
        () => getItemName(ITEMS.times, selectedTimeKey),
        [selectedTimeKey]
    );
    return [
        createMobileItemMenu(pageName, ITEMS.pages),
        createMobileItemMenu(timeName, ITEMS.times)
    ];
};

export const useNavbarItems = (
    selectedPageKey: string,
    selectedTimeKey: string
): NonNullable<MenuProps['items']> => {
    const [isAuthorized, hasChecked, authBtnTxt, authBtnAction] =
        useNavbarAuthCheck();
    const breakpointName = useBreakpointName();

    const AuthNavItem = createAuthNavItem(
        isAuthorized,
        authBtnAction,
        authBtnTxt
    );

    const mobileItems = useMobileItems(selectedPageKey, selectedTimeKey);
    const desktopItems = useDesktopItems();

    const [PageItems, TimeItems] = match(breakpointName)
        .with(BreakpointName.XS, () => mobileItems)
        .otherwise(() => desktopItems);

    return match({ isAuthorized, hasChecked })
        .with({ isAuthorized: true, hasChecked: true }, () => [
            ...(PageItems ?? []),
            ...(TimeItems ?? []),
            ...(AuthNavItem ?? [])
        ])
        .with({ isAuthorized: false, hasChecked: true }, () => AuthNavItem)
        .otherwise(() => []);
};
