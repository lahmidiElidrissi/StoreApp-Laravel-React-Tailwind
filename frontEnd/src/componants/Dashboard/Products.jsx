import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axiosHttpClient from '../../Utils/api';
import { useNavigate } from 'react-router-dom';
import Toastify from 'toastify-js'
import { customStylesDatatable, paginationOptionsWithArabicLang } from '../../Utils/helpers';

const MainContent = () => {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [orderColumn, setOrderColumn] = useState('');
  const [orderDir, setOrderDir] = useState('asc');
  const navigate = useNavigate();

  // fetch all products
  const fetchData = () => {
    const params = new URLSearchParams({
      search: search,
      orderColumn: orderColumn,
      orderDir: orderDir
    });

    axiosHttpClient.get(`${import.meta.env.VITE_URL_BACKEND}/dashboard/products?${params.toString()}`)
      .then(response => {
        setData(response.data.data || []);
      })
      .catch(error => {
        console.error('Google login failed', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [search, orderColumn, orderDir]);


  // handle sort datatable
  const handleSort = (column, sortDirection) => {
    setOrderColumn(column.selector);
    setOrderDir(sortDirection);
  };

  const columns = [
    { name: 'الصورة', selector: (row) => <img src={row?.images[0].path} alt={row?.name} className="w-[50%] h-[50%]"></img> },
    { name: 'اسم', selector: (row) => row?.name, sortable: true },
    { name: 'وصف', selector: (row) => row?.description ? row.description.slice(0, 50) + "..." : "", sortable: true },
    { name: 'السعر', selector: (row) => row?.price, sortable: true },
  ];

  // function to delete product
  const onDelete = (id) => {
    axiosHttpClient.delete(`${import.meta.env.VITE_URL_BACKEND}/remove/product/${id}`)
      .then(response => {
        fetchData();
        if ( response.status === 200 ) {
          Toastify({
            text: "تم الحذف بنجاح",
            className: "text-1xl",
            position: "center",
            style: {
              background: "linear-gradient(to right, rgb(182, 244, 146), rgb(51, 139, 147))",
              marginTop: "10vh",
              width: "70%",
            },
          }).showToast();
        }else{
          Toastify({
            text: "ليس لديك صلاحية الحذف",
            className: "text-1xl",
            position: "center",
            style: {
              background: "linear-gradient(107.2deg, rgb(150, 15, 15) 10.6%, rgb(247, 0, 0) 91.1%)",
              marginTop: "10vh",
              width: "70%",
            },
          }).showToast();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  // function to update product
  const onUpdate = (id) => {
    navigate(`/dashboard/products/edit/${id}`);
  };

  const enhancedColumns = [
    ...columns,
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <button
            onClick={() => onUpdate(row.id)}
            className="bg-yellow-500 m-1 px-4 py-1 rounded text-white hover:bg-yellow-600 text-sm"
          >
            تعديل
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="bg-slate-600 m-1 px-4 py-1 rounded text-white hover:bg-slate-700 text-sm"
          >
            حذف
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
  ];

  return (
    <div className="flex-1 py-5 md:p-6 md:pr-64 bg-slate-100">
      <div className='mx-5'>
        <h2 class="text-3xl font-bold !leading-tight text-black sm:text-4xl md:text-[45px] md:p-5 text-center"> المنتجات</h2>
        <input
          className='placeholder:italic placeholder:text-slate-400 block bg-white w-auto border border-slate-300 rounded-md py-1 pr-2 shadow-sm focus:outline-none focus:border-yellow-100 focus:ring-yellow-600 focus:ring-1 sm:text-sm m-5'
          type="text"
          placeholder="  البحث عن منتج"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <DataTable
          columns={enhancedColumns}
          data={data}
          pagination
          onSort={handleSort}
          customStyles={customStylesDatatable}
          paginationComponentOptions={paginationOptionsWithArabicLang}
        />
      </div>
    </div>
  );
};

export default MainContent;
