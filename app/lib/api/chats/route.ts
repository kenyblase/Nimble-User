import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productId, sellerId, buyerId, productName, productPrice, productImages = [] } = await request.json();

    if (!productId || !sellerId || !buyerId) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, sellerId, buyerId' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    
    // First, check if chat already exists
    const checkResponse = await fetch(`${backendUrl}/api/chats/check-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        buyerId,
        sellerId
      })
    });

    let chatData;

    if (checkResponse.ok) {
      const existingChat = await checkResponse.json();
      if (existingChat.data?.chat) {
        chatData = existingChat.data.chat;
        console.log('✅ Found existing chat:', chatData._id);
      } else if (existingChat.chat) {
        chatData = existingChat.chat;
        console.log('✅ Found existing chat:', chatData._id);
      }
    }

    // If no existing chat, create a new one
    if (!chatData) {
      console.log('🆕 Creating new chat for product:', productId);
      const createResponse = await fetch(`${backendUrl}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productId,
          seller: sellerId,
          buyer: buyerId,
          productDetails: {
            name: productName,
            price: productPrice,
            images: productImages
          }
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('❌ Chat creation failed:', errorText);
        throw new Error(`Failed to create chat: ${createResponse.status}`);
      }

      const newChat = await createResponse.json();
      chatData = newChat.data || newChat;
      console.log('✅ Created new chat:', chatData._id);
    }

    return NextResponse.json({ 
      success: true, 
      chat: chatData 
    });

  } catch (error) {
    console.error('❌ Chat creation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}