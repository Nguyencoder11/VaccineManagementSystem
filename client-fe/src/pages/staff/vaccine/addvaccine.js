import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod, postMethod, postMethodPayload, uploadSingleFile} from '../../../services/request';
import { formatMoney } from '../../../services/money';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';

var token = localStorage.getItem("token");

var linkbanner = '';
var description = '';
const StaffAddVaccine = ()=>{
    const [item, setItem] = useState(null);
    const [type, setType] = useState([]);
    const [manufacturer, setManufacturer] = useState([]);
    const [ageGroup, setAgeGroup] = useState([]);
    const [typeSelect, settypeSelect] = useState(null);
    const [manufacturerSelect, setmanufacturerSelect] = useState(null);
    const [ageGroupSelect, setageGroupSelect] = useState(null);
    const editorRef = useRef(null);

    const [textButton, setTextbutton] = useState("Thêm vaccine");

    useEffect(()=>{
        const getData= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                setTextbutton("Cập nhật vaccine")
                var response = await getMethod('/api/vaccine/public/find-by-id?id=' + id);
                var result = await response.json();
                setItem(result)
                description = result.description;
                linkbanner = result.image
                settypeSelect(result.vaccineType)
                setmanufacturerSelect(result.manufacturer)
                setageGroupSelect(result.ageGroup)
            }
        };
        getData();
        
        const getSelect= async() =>{
            var response = await getMethod('/api/vaccine-type/find-all');
            var result = await response.json();
            setType(result)
            var response = await postMethod('/api/manufacturer/find-all');
            var result = await response.json();
            setManufacturer(result)
            var response = await postMethod('/api/age-group/find-all');
            var result = await response.json();
            setAgeGroup(result)
        };
        getSelect();

    }, []);

    function handleEditorChange(content, editor) {
        description = content;
    }

    function onchangeFile(){
        const [file] = document.getElementById("fileimage").files
        if (file) {
            document.getElementById("imgpreview").src = URL.createObjectURL(file)
        }
    }


    async function addVaccine(event) {
        event.preventDefault();
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var linktam = await uploadSingleFile(document.getElementById('fileimage'))
        if(linktam != null) linkbanner = linktam
        var payload = {
            "id": id,
            "name": event.target.elements.vaccineName.value,
            "description": description,
            "image": linkbanner,
            "price": event.target.elements.price.value,
            "inventory": event.target.elements.inventory.value,
            "quantity": event.target.elements.inventory.value,
            "vaccineTypeId": typeSelect.id,
            "manufacturerId": manufacturerSelect.id,
            "ageGroupId": ageGroupSelect.id,
            "status": event.target.elements.status.value,
        }
        var res = null;
        if(id == null){
            res = await postMethodPayload('/api/vaccine/create', payload)
        }
        else{
            res = await postMethodPayload('/api/vaccine/update', payload)
        }
        if (res.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Thành công!",
                preConfirm: () => {
                    window.location.href = 'vaccine'
                }
            });
        } else {
            if(res.status == 417){
                var result = await res.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Thêm/ sửa thất bại");
            }
        }
    }

    return (
        <>
            <div className='row'>
                <div className='col-sm-4'>
                    <div className='headpageadmin'>
                        <span>{textButton}</span>
                    </div>
                </div>
            </div>
            <form className='row' onSubmit={addVaccine} method='post'>
                <div className='col-sm-5'>
                    <label class="lb-form">Tên vaccine</label>
                    <input defaultValue={item?.name} name='vaccineName' type="text" class="form-control"/><br/>
                    <label class="lb-form">Giá tiền</label>
                    <input defaultValue={item?.price} name='price' class="form-control"/><br/>
                    <label class="lb-form">Số lượng</label>
                    <input defaultValue={item?.inventory} name='inventory' class="form-control"/><br/>
                    <label class="lb-form">Trạng thái</label>
                    <input defaultValue={item?.status} name='status' class="form-control"/><br/>
                    <label class="lb-form">Ảnh</label>
                    <input onChange={onchangeFile} id='fileimage' type='file' class="form-control"/><br/>
                    <img id='imgpreview' src={item?.image} className='imgtable'/><br/>
                    <label class="lb-forms">Danh mục</label>
                    <Select
                        options={type}
                        value={typeSelect}
                        onChange={settypeSelect}
                        getOptionLabel={(option) => option.typeName} 
                        getOptionValue={(option) => option.id}    
                        closeMenuOnSelect={false}
                        name='danhMuc'
                        placeholder="Chọn danh mục"
                    />
                    <label class="lb-forms">Nhà máy sản xuất</label>
                    <Select
                        options={manufacturer}
                        value={manufacturerSelect}
                        onChange={setmanufacturerSelect}
                        getOptionLabel={(option) => option.name} 
                        getOptionValue={(option) => option.id}    
                        closeMenuOnSelect={false}
                        name='manufacturer'
                        placeholder="Chọn nhà máy sản xuất"
                    />
                    <label class="lb-forms">Nhóm tuổi</label>
                    <Select
                        options={ageGroup}
                        value={ageGroupSelect}
                        onChange={setageGroupSelect}
                        getOptionLabel={(option) => option.ageRange} 
                        getOptionValue={(option) => option.id}    
                        closeMenuOnSelect={false}
                        name='ageGroup'
                        placeholder="Chọn nhóm tuổi"
                    />
                </div>
                <div className='col-sm-7'>
                    <label class="lb-forms">Mô tả vaccine</label>
                    <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/mcvdwnvee5gbrtksfafzj5cvgml51to5o3u7pfvnjhjtd2v1/tinymce/6/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor} 
                                        initialValue={item==null?'':item.description}
                                        onEditorChange={handleEditorChange}/><br/>
                    <button className='btn btn-primary form-control'>{textButton}</button>
                </div>
            </form>
        </>
    );
}

export default StaffAddVaccine;