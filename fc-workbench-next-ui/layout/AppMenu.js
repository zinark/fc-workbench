import React, {useContext} from 'react';
import AppMenuitem from './AppMenuitem';
import {LayoutContext} from './context/layoutcontext';
import {MenuProvider} from './context/menucontext';

const AppMenu = () => {
    const {layoutConfig} = useContext(LayoutContext);

    const model = [
        {
            label: 'Design',
            items: [
                {label: 'Workbenchs', icon: 'pi pi-fw pi-desktop', to: '/workbenchs'}
            ]
        },
        {
            label: 'Export',
            items: [
                {label: 'Specflow', icon: 'pi pi-fw pi-file-export'}
            ]
        },
        {
            label: 'Saved Workbenchs',
            items: [
                {
                    label: 'wallet sample',
                    icon: 'pi pi-fw pi-bookmark',
                    // to: '/fc-workbench/1'
                },
                {
                    label: 'auth sample',
                    icon: 'pi pi-fw pi-bookmark',
                    // to: '/fc-workbench/2'
                }
            ]
        },

    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
                        <li className="menu-separator"></li>;
                })}

                {/*<Link href="https://blocks.primereact.org" target="_blank" style={{cursor: 'pointer'}}>*/}
                {/*    <img alt="Prime Blocks" className="w-full mt-3"*/}
                {/*         src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`}/>*/}
                {/*</Link>*/}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
