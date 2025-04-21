import lich from '../../assest/images/lich.png'
import { useState, useEffect } from 'react'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import Chart from "chart.js/auto";


var token = localStorage.getItem("token");


const HomeAdmin = ()=>{
    const [doanhthu, setDoanhThu] = useState(0);
    const [donHoanThanhHomNay, setDonHoanThanhHomNay] = useState(0);
    const [items, setItems] = useState([]);

    useEffect(()=>{

        function getMauSac(){
            var arr = ['#4e73df','#1cc88a','#36b9cc','#eb9534','#ed00c6','#edd500']
            var act = document.getElementsByClassName("border-left");
            var lbcard = document.getElementsByClassName("lbcard");
            for(var i=0; i<act.length; i++){
                act[i].style.borderLeft = '.25rem solid '+arr[i]
            }
            for(var i=0; i<lbcard.length; i++){
                lbcard[i].style.color = arr[i]
            }
        }
        getMauSac();

        var nowYear = new Date().getFullYear();
        revenueYear(nowYear)
        var main = ''
        for(var i=nowYear; i> Number(nowYear)-Number(10); i--){
            main += `<option value="${i}">Năm ${i}</option>`
        }
        document.getElementById("nams").innerHTML = main

        const getVaccine = async () => {
            var response = await getMethod('/api/statistic/admin/vaccine-bc');
            var result = await response.json();
            setItems(result)
        };
        getVaccine();
        const getDt = async () => {
            var response = await getMethod('/api/statistic/admin/thong-ke');
            var result = await response.json();
            console.log(result);
            
            setDoanhThu(result)
        };
        getDt();
    }, []);



    
    function loadByNam() {
        var nam = document.getElementById("nams").value;
        revenueYear(nam);
    }
    
    

  
    return(
       <>
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Doanh thu tháng này</span>
                    <span className='solieudoanhthu'>{formatMoney(doanhthu.doanhThuThangNay)}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Doanh thu hôm nay</span>
                    <span className='solieudoanhthu'>{formatMoney(doanhthu.doanhThuHomNay)}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Số lượng tài khoản</span>
                    <span className='solieudoanhthu'>{doanhthu.nunUser}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Số lượng vaccine hiện có</span>
                    <span className='solieudoanhthu'>{doanhthu.nunVaccine}</span>
                </div>
            </div>
        </div>

        <div>
            <div class="col-sm-12 header-sp-thongke row ">
                <div class="col-md-3">
                    <label class="lbbooking">Chọn năm cần xem</label>
                <select id="nams" class="form-control">
                </select>
                </div>
                <div class="col-md-2">
                    <label class="lbbooking whitespace" dangerouslySetInnerHTML={{__html: '<span>&ThinSpace;</span>'}}></label>
                    <button onClick={()=>loadByNam()} class="btn btn-primary form-control"><i class="fa fa-filter"></i> Lọc</button>
                </div>
            </div>
            <div class="col-sm-12 divtale">
                <div class="card chart-container divtale">
                    <canvas id="chart"></canvas>
                </div>
            </div>
        </div>

        <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách vaccine tiêm nhiều</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tên vaccine</th>
                                <th>Giá bán</th>
                                <th>Loại vaccine</th>
                                <th>Số lượng tiêm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.vaccine.id}</td>
                                    <td>{item.vaccine.name}</td>
                                    <td>{formatMoney(item.vaccine.price)}</td>
                                    <td>{item.vaccine.vaccineType.typeName}</td>
                                    <td>{item.sold}</td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>

       </>
    );
}

async function revenueYear(nam) {
        
    if (nam < 2000) {
        nam = new Date().getFullYear()
    }
    var url = 'http://localhost:8080/api/statistic/admin/revenue-year?year=' + nam;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    console.log(list)
    var main = '';
    for (var i = 0; i < list.length; i++) {
        if (list[i] == null) {
            list[i] = 0
        }
    }


    var lb = 'doanh thu năm ' + nam;
    const ctx = document.getElementById("chart").getContext('2d');
    let chartStatus = Chart.getChart("chart"); // <canvas> id
    if (chartStatus != undefined) {
    chartStatus.destroy();
    }
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["tháng 1", "tháng 2", "tháng 3", "tháng 4",
                "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
            ],
            datasets: [{
                label: lb,
                backgroundColor: 'rgba(161, 198, 247, 1)',
                borderColor: 'rgb(47, 128, 237)',
                data: list,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value) {
                            return formatmoney(value);
                        }
                    }
                }]
            }
        },
    });
}

function formatmoney(money) {
    return VND.format(money);
}

const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

export default HomeAdmin;