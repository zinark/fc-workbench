import React, {useEffect, useState} from 'react';
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {Rating} from 'primereact/rating';
import {InputText} from 'primereact/inputtext';
import {WorkbenchService} from "../../fc-workbench/service/WorkbenchService";
import Link from 'next/link'
import {Menubar} from "primereact/menubar";
import {Dialog} from "primereact/dialog";

const Workbenchs = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('');
    const [filtered, setFiltered] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [benchIdToDelete, setBenchIdToDelete] = useState(null)

    const benchMenuItems = [
        {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            command: () => onNewWorkbench()
        },
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save'
        }
    ];

    const onNewWorkbench = () => {
        WorkbenchService.createWorkbench(0).then(data => {
            // setData(data.items);
            setFilter('')
        });
    }
    const sortOptions = [
        {label: 'Date', value: '!createdAt'},
        {label: 'Date Desc', value: 'createdAt'}
    ];

    useEffect(() => {
        WorkbenchService.listWorkbenchs().then(data => {
            setData(data.items);
            setFilter('')
        });
    }, []);

    const onFilter = (e) => {
        const value = e.target.value;
        setFilter(value);
        if (value.length === 0) {
            setFiltered(null);
        } else {
            const filtered = data.filter((bench) => {
                return bench.name.toLowerCase().includes(value);
            });
            setFiltered(filtered);
        }
    };

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Date"
                      onChange={onSortChange}/>
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText value={filter} onChange={onFilter} placeholder="Search by Name"/>
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)}/>
        </div>
    );

    const dataListView = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <img src={`/demo/images/product/${data.image}`} alt={data.name}
                         className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"/>
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <Link href={"/workbench/" + data.id}>Ferhat</Link>
                        <div className="font-bold text-2xl">{data.name}</div>
                        <div className="mb-2">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false} className="mb-2"></Rating>
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"></i>
                            <span className="font-semibold">{data.category}</span>
                        </div>
                    </div>
                    <div
                        className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span
                            className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart"
                                disabled={data.inventoryStatus === 'OUTOFSTOCK'} className="mb-2 p-button-sm"></Button>
                        {/*<span*/}
                        {/*    className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>*/}
                    </div>
                </div>
            </div>
        );
    };
    const onDeleteBench = () => {
        WorkbenchService.deleteWorkbench(benchIdToDelete).then(data => {
            setFilter('')
        });
        setShowDelete(false);
    };
    const deletePopup = () => {
        return <>
            <Button type="button" label="No" icon="pi pi-times" onClick={() => setShowDelete(false)} text/>
            <Button type="button" label="Yes" icon="pi pi-check" onClick={() => onDeleteBench()} text autoFocus/>
        </>
    }

    const dataGridView = (data) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 p-6 border-2 surface-border">

                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"/>
                            <span className="font-semibold">{data.category}</span>
                        </div>
                        <span className="`product-badge status-active`">Active</span>
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        {/*<img src={`/demo/images/product/${data.image}`} alt={data.name}*/}
                        {/*     className="w-9 shadow-2 my-3 mx-0"/>*/}


                        <Link href={"/workbench/" + data.id}>
                            <div className="text-4xl font-bold"> {data.title} </div>

                        </Link>

                        <div className="mb-3">
                            {data.description}
                        </div>
                        {/*<Rating value={data.rating} readOnly cancel={false}/>*/}
                        <span className="font-semibold">{data.screenCount} screen(s)</span>
                        <span className="font-semibold">{data.adapterCount} adapter(s)</span>

                    </div>
                    <div className="flex align-items-center justify-content-center">
                        {/*<Link href={"/delete/" + data.id}>*/}
                        {/*    <Button icon="pi pi-trash" tooltip={"Delete"} severity="danger" outlined/>*/}
                        {/*</Link>*/}

                        <Link href={"/run/" + data.id}>
                            <Button rounded text icon="pi pi-arrow-circle-right" severity="success" tooltip={"Run"}/>
                        </Link>

                        <Button text rounded label="Delete" icon="pi pi-trash" severity="warning"
                                onClick={() => {
                                    setBenchIdToDelete(data.id)
                                    setShowDelete(true);
                                }}/>

                        <Dialog header="Confirmation"
                                visible={showDelete}
                                onHide={() => setShowDelete(false)}
                                style={{width: '350px'}} modal
                                footer={deletePopup}>

                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                                <span>Are you sure you want to proceed? {benchIdToDelete}</span>
                            </div>

                        </Dialog>

                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data, layout) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataListView(data);
        } else if (layout === 'grid') {
            return dataGridView(data);
        }
    };

    return (
        <>
            <div className="grid list-demo">
                <div className="col-12">
                    <div className="card">
                        <h5>Workbenchs</h5>
                        <Menubar model={benchMenuItems}></Menubar>

                        <DataView value={filtered || data}
                                  layout={layout}
                                  paginator
                                  rows={9}
                                  sortOrder={sortOrder}
                                  sortField={sortField}
                                  itemTemplate={itemTemplate}
                                  header={dataViewHeader}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Workbenchs;
