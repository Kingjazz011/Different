const products = [
      {id:1,name:'Apex Overshirt',price:189.00,img:'https://picsum.photos/800/900?random=101',tag:'Structured premium cotton'},
      {id:2,name:'Volt Hoodie',price:150.00,img:'https://picsum.photos/800/900?random=102',tag:'Neon piping detail'},
      {id:3,name:'Tailored Jogger',price:129.00,img:'https://picsum.photos/800/900?random=103',tag:'Slim across the leg'},
      {id:4,name:'Signature Tee',price:59.00,img:'https://picsum.photos/800/900?random=104',tag:'180gsm heavy cotton'},
      {id:5,name:'Urban Trench',price:299.00,img:'https://picsum.photos/800/900?random=105',tag:'Water-resistant finish'},
      {id:6,name:'Edge Cap',price:39.00,img:'https://picsum.photos/800/900?random=106',tag:'One-size adjustable'}
    ];

    const productGrid = document.getElementById('productGrid');
    const template = document.getElementById('productTemplate').innerHTML;

    function currency(val){
      return val.toFixed(2);
    }

    function renderProducts(){
      productGrid.innerHTML = products.map(p=>{
        return template.replace('__IMG__',p.img)
                       .replace('__NAME__',p.name)
                       .replace('__ID__',p.id)
                       .replace('__PRICE__',currency(p.price))
                       .replace('__TAGLINE__',p.tag)
      }).join('');
      attachProductListeners();
    }

    // CART
    let cart = {};
    const cartCount = document.getElementById('cartCount');
    const cartPanel = document.getElementById('cartPanel');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    function updateCartUI(){
      const keys = Object.keys(cart);
      cartCount.textContent = keys.reduce((s,k)=>s+cart[k].qty,0);
      cartItems.innerHTML = keys.length? keys.map(k=>{
        const it = cart[k];
        return `
          <div class="cart-item">
            <img src="${it.img}" alt="${it.name}" />
            <div style="flex:1">
              <div style="font-weight:700">${it.name}</div>
              <div style="color:var(--muted);font-size:13px">$${currency(it.price)} × ${it.qty}</div>
            </div>
            <div class="qty">
              <button data-action="dec" data-id="${it.id}">-</button>
              <div style="min-width:22px;text-align:center">${it.qty}</div>
              <button data-action="inc" data-id="${it.id}">+</button>
            </div>
          </div>
        `}).join('') : '<div style="color:var(--muted);padding:16px">Your bag is empty.</div>';

      const total = keys.reduce((s,k)=>s + cart[k].price * cart[k].qty,0);
      cartTotal.textContent = '$' + currency(total);

      // attach qty buttons
      cartItems.querySelectorAll('button[data-action]').forEach(btn=>btn.addEventListener('click',e=>{
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if(action==='inc') cart[id].qty++;
        else { cart[id].qty--; if(cart[id].qty<=0) delete cart[id]; }
        updateCartUI();
      }));
    }

    function addToCart(pid,qty=1){
      const p = products.find(x=>x.id===pid);
      if(!p) return;
      if(cart[pid]) cart[pid].qty += qty; else cart[pid] = {id:p.id,name:p.name,price:p.price,img:p.img,qty:qty};
      // little animation
      const badge = document.getElementById('cartCount');
      badge.animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:300});
      updateCartUI();
    }

    function attachProductListeners(){
      // quick-add buttons
      document.querySelectorAll('.product .quick-add').forEach((btn,i)=>{
        btn.addEventListener('click',e=>{
          const id = products[i].id;
          addToCart(id,1);
        })
      });
      // clicking thumbnail opens product (demo: add to cart modal)
      document.querySelectorAll('.thumb').forEach(el=>{
        el.addEventListener('click',e=>{
          e.preventDefault();
          const id = Number(el.getAttribute('data-id'));
          const p = products.find(x=>x.id===id);
          if(!p) return;
          // open quick product modal (simple confirm)
          const ok = confirm(`Add ${p.name} — $${currency(p.price)} to your bag?`);
          if(ok) addToCart(id,1);
        })
      });
    }

    // cart panel toggle
    document.getElementById('cartToggle').addEventListener('click',()=>{
      cartPanel.classList.toggle('open');
      cartPanel.setAttribute('aria-hidden',!cartPanel.classList.contains('open'));
    });
    document.getElementById('closeCart').addEventListener('click',()=>{cartPanel.classList.remove('open');});

    // Checkout (demo)
    document.getElementById('checkout').addEventListener('click',()=>{
      if(Object.keys(cart).length===0){ alert('Your bag is empty'); return; }
      const total = Object.keys(cart).reduce((s,k)=>s+cart[k].price*cart[k].qty,0);
      alert('Checkout — Total: $' + currency(total) + '\n\n(Payment page loading)');
    });

    // init
    renderProducts();
    updateCartUI();