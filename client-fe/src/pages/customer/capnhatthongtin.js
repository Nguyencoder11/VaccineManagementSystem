import Footer from '../../layout/customer/footer/footer'
import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2'

var avatar = '';
async function handleUpdateInfor(event) {
    event.preventDefault();
    document.getElementById("loading").style.display = 'block'
    var LinkImg = await uploadSingleFile(document.getElementById("fileupload"));
    if(LinkImg != null){
        avatar = LinkImg;
    }
    const payload = {
        fullName: event.target.elements.fullname.value,
        gender: event.target.elements.gender.value,
        birthdate: event.target.elements.birthdate.value,
        phone: event.target.elements.phone.value,
        avatar: avatar,
        city: event.target.elements.city.value,
        district: event.target.elements.district.value,
        ward: event.target.elements.ward.value,
        street: event.target.elements.street.value,
        insuranceStatus: document.getElementById("insurance").checked,
    };
    const res = await postMethodPayload('/api/customer-profile/customer/update-profile', payload);
    if (res.status == 417) {
        var result = await res.json()
        toast.warning(result.defaultMessage);
    }
    if(res.status < 300){
        toast.success("Cập nhật thông tin thành công")
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
    }
    document.getElementById("loading").style.display = 'none'
};
function CapNhatThongTin(){
    const [address, setAddress] = useState([]);
    const [huyen, setHuyen] = useState([]);
    const [profile, setProfile] = useState(null);
    const [tinh, setTinh] = useState(null);
    const [huyencs, setHuyenCs] = useState(null);
    const [baohiem, setBaoHiem] = useState(false);
    
    useEffect(()=>{
        const getAddress= async() =>{
            const response = await fetch('https://provinces.open-api.vn/api/?depth=2', {
            });
            var result = await response.json();
            setAddress(result)
        };
        const getCustomer= async() =>{
            const response = await getMethod('/api/customer-profile/customer/find-by-user')
            var result = await response.json();
            setProfile(result)
            setTinh(result.city);
            avatar = result.avatar;
            setBaoHiem(result.insuranceStatus)

            // const res = await fetch('https://provinces.open-api.vn/api/?depth=2', {
            // });
            // var province = await res.json();
            // for(var i=0; i< province.length; i++){
            //     if(province[i].name == result.city){
            //         setHuyen(province[i].districts)
            //     }
            // }
            // setHuyenCs(result.district);
        };
        getAddress();
        getCustomer();
    }, []);
    
    const loadHuyen = async (option) => {
        var value = option.value;
        for(var i=0; i< address.length; i++){
            if(address[i].name == value){
                setHuyen(address[i].districts)
            }
        }
        setTinh(option.value)
    }

    function clickChooseFile(){
        document.getElementById("fileupload").click();
    }

    function preImage(){
        const [file] = document.getElementById("fileupload").files
        if (file) {
            document.getElementById("imgpreview").src = URL.createObjectURL(file)
        }
    }

    function changeBh(){
        var value = document.getElementById("insurance").checked
        setBaoHiem(value)
    }

    return(
        <form onSubmit={handleUpdateInfor} class="row">
            <div className='col-sm-4'>
                <label class="lbacc">Họ tên *</label>
                <input name="fullname" defaultValue={profile!=null?profile.fullName:''} class="form-control" required/>
                <label class="lbacc">Số điện thoại liên lạc *</label>
                <input name="phone" defaultValue={profile!=null?profile.phone:''} class="form-control" required/>
                <label class="lbacc">Giới tính *</label>
                <select name="gender" class="form-control">
                    <option value="Male" selected={profile==null?false:(profile.gender =='Male')}>Nam</option>
                    <option value="Female" selected={profile==null?false:(profile.gender =='Female')}>Nữ</option>
                    <option value="Other" selected={profile==null?false:(profile.gender =='Other')}>Khác</option>
                </select>
                <label class="lbacc">Ngày sinh</label>
                <input name="birthdate" defaultValue={profile!=null?profile.birthdate:''} type='date' class="form-control" required/>
                <br/>
                <label class="checkbox-custom">Đã có bảo hiểm 
                    <input id='insurance' onChange={changeBh} type="checkbox" checked={baohiem}/>
                    <span class="checkmark-checkbox"></span>
                </label>
            </div>
            <div className='col-sm-4'>
                <label class="lbacc">Tỉnh/ Thành phố</label>
                <Select
                    options={address.map((item) => ({
                        label: item.name,
                        value: item.name,
                    }))}
                    onChange={loadHuyen}
                    placeholder="Chọn tỉnh/ thành phố"
                    name='city'
                    value={{ label: tinh, value: tinh }}
                    isSearchable={true} 
                />

                <label class="lbacc">Quận/ huyện</label>
                <select class="form-control" name='district' id='district'>
                    {huyen.map((item, index)=>{
                        return <option selected={huyencs == item.name?true:false} value={item.name}>{item.name}</option>
                    })}
                </select>
                <label class="lbacc">Phường/ xã</label>
                <input name="ward" defaultValue={profile!=null?profile.ward:''} class="form-control" required/>
                <label class="lbacc">tên đường, số nhà</label>
                <input name="street" class="form-control"  defaultValue={profile!=null?profile.street:''}  required/>
                <br/>
                <div id="loading">
                    <div class="bar1 bar"></div>
                </div><br/>
                <button type="submit" class="btndoimk">LƯU</button>
            </div>
            <div className='col-sm-4'>
                <label class="lbacc">Chọn hình ảnh</label>
                <img id='imgpreview' src={profile!=null?profile.avatar:''} className='image-profile'/>
                <button onClick={()=>clickChooseFile()} type='button' className='btnuploadimage-profile'><i className='fa fa-upload'></i> Chọn ảnh</button>
                <input onChange={()=>preImage()} type='file' className='hidden' name="fileupload" id='fileupload'/>
            </div>
        </form>
    );
}

export default CapNhatThongTin;
