import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    websiteId: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
    addedAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
