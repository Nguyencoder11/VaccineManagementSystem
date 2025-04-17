import { useState, useEffect } from 'react';
import $ from 'jquery';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getMethod, postMethodPayload} from '../../services/request';
import Select from 'react-select';

const AdminAddDanhMuc = () => {
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [selectParent, setselectParent] = useState(null);
    useEffect(() => {
        const getDanhMucCha = async() =>{
            var response = await getMethod('/api/vaccine-type/find-primary')
            var result = await response.json();
            setItems(result)
        };
        getDanhMucCha();

        const getById = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/vaccine-type/find-by-id?id='+id)
                var result = await response.json();
                setCategory(result)
                document.getElementById("primaryCate").checked = result.isPrimary
                setselectParent(result.vaccineType)
            }
        };
        getById();
    }, []);

    async function saveCategory() {
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var url = '/api/vaccine-type/add';
        var obj = {
            "id": id,
            "typeName": document.getElementById("catename").value,
            "isPrimary": document.getElementById("primaryCate").checked,
        };
        if(selectParent != null){
            obj.vaccineType = { id: selectParent.id };
        }
        const response = await postMethodPayload(url,obj)
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Thành công!",
                preConfirm: () => {
                    window.location.href = 'danhmuc'
                }
            });
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    return (
        <>
            <div class="col-sm-5">
                    <label class="lb-form">Tên danh mục</label>
                    <input defaultValue={category?.typeName} id="catename" type="text" class="form-control"/><br/>
                    <label class="checkbox-custom">Danh mục chính 
                        <input id="primaryCate" type="checkbox"/>
                        <span class="checkmark-checkbox"></span>
                    </label><br/>
                    <label class="lb-form">Danh mục cha</label>
                    <Select
                        options={items}
                        value={selectParent}
                        onChange={setselectParent}
                        getOptionLabel={(option) => option.typeName} 
                        getOptionValue={(option) => option.id}    
                        closeMenuOnSelect={false}
                        name='danhmuccha'
                        placeholder="Chọn danh mục cha"
                    />
                    <br/>
                    <button onClick={()=>saveCategory()} class="btn btn-success form-control action-btn">Thêm/ Cập nhật danh mục</button>
            </div>
        </>
    );
};

export default AdminAddDanhMuc;