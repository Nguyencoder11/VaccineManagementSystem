import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mastercard from '../../../assest/images/mastercard.png';
import vnapy from '../../../assest/images/vnpay.png';


library.add(fas, fab);

function Footer() {
  return (
   
     <footer class="footer"
     style={{
      background: '#616161',
      padding: '30px 0',
      fontSize: '14px',
      color:'#ffffff',
      borderTop: '1px solid #ddd',
    }}>
     <div class="container">
         <div class="row">
             <div class="col-md-4">
                 <h5>Tên Công Ty</h5>
                 <p>Công Ty VaxmsFpt</p>
                 <p><strong>Địa chỉ:</strong> TP. HCM, VIET NAM</p>
                 <p><strong>Liên hệ:</strong> 0967.332.130</p>
                 <p><strong>Email:</strong> <a href="mailto:vaxms@gmail.com">vaxms@gmail.com</a></p>
             </div>
             
             <div class="col-md-4">
                 <h5>Vị trí của chúng tôi</h5>
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.610010537023!2d106.80730807475265!3d10.841127589311574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1735216542366!5m2!1svi!2s" 
                   width="100%" 
                   height="200" 
                   allowfullscreen="" 
                   loading="lazy">

                 </iframe>
             </div>
             
             <div class="col-md-4">
             <h5>Liên hệ</h5>
                    <ul class="list-unstyled">
                        <li>
                            <a href="https://www.facebook.com/YourPageName" target="_blank">
                                <img src="https://img.icons8.com/fluency/24/facebook-new.png" alt="Facebook"/> Facebook
                            </a>
                        </li>
                        <li>
                            <a href="https://zalo.me/0967332130" target="_blank">
                                <img src="https://banner2.cleanpng.com/20180907/bub/kisspng-logo-scalable-vector-graphics-clip-art-zalo-zalo-logo-svg-vector-amp-png-transparent-vecto-1713943674787.webp"
                                alt="Zalo"
                                style={{width:'23px'}}
                                /> Zalo
                            </a>
                        </li>
                    </ul>
             </div>
         </div>
         <div class="text-center mt-3">
             <p>&copy; 2024 Công Ty TNHH ABC. All Rights Reserved.</p>
         </div>
     </div>
 </footer>
  );
}

export default Footer;
