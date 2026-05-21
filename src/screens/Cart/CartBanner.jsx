import { useCart } from "../../context/CartContext"

const CartBanner = () => {
const {cartCount} = useCart()
    return (
 <div style={{position:"absolute",background:"blue",color:"white",marginLeft:100, marginRight:100, top:100, borderRadius:50,width:500}}>
    <span>{cartCount}</span>
 </div>
    )
}

export default CartBanner