// Define Message interface
// Update the Message interface
export interface Message {
  _id: string;
  chatId?: string;
  chat?: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  type: 'text' | 'invoice' | 'payment' | 'offer' | 'extra-charge' | 'offer-accepted' | 'payment-request' | 'counter-declined';
  text?: string;
  offer?: {
    amount: number;
    status: 'sent' | 'accepted' | 'declined';
    proposedBy: string;
    bestPrice?: number;
    initialOfferMessageId?: string;
  };
  invoice?: {
    amount: number;
    description?: string;
    status: 'pending' | 'paid' | 'cancelled';
    currency?: string;
    dueDate?: string;
    items?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    notes?: string;
  };
  payment?: any;
  extraCharge?: any;
  isFromAdmin?: boolean;
  readBy?: string[];
  tempId?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

interface Chat {
  _id: string;
  buyer: User;
  seller: User;
  product: Product;
  lastMessage: string;
  isReported: boolean;
  adminInvolved: string[];
  updatedAt: string;
  createdAt: string;
}


export interface MessageComponentProps {
  message: Message;
  currentUserId: string;
  chat?: Chat;
  onAcceptOffer?: (message: Message) => void;
  onDeclineOffer?: (message: Message) => void;
  onPayNow?: (message: Message) => void;
  onDecline?: () => void;
  onAcceptAndPay?: (message: Message) => void;
}