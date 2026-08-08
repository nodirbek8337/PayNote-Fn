import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs/operators';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { ToastService } from '../../shared/services/toast.service';
import { SalesProduct, SalesService } from '../service/sales.service';

type CartId = 1 | 2;

type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
};

@Component({
    selector: 'sales',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ConfirmDialogModule, InputTextModule, MoneyPipe],
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss'],
    providers: [ConfirmationService]
})
export class SalesComponent implements OnInit {
    private readonly cartStorageKey = 'payNoteSalesCarts';
    private readonly activeCartStorageKey = 'payNoteActiveSalesCart';
    private salesService = inject(SalesService);
    private toast = inject(ToastService);
    private confirmationService = inject(ConfirmationService);

    products: SalesProduct[] = [];
    search = '';
    activeCart: CartId = 1;
    loading = false;
    sellingCart: CartId | null = null;
    readonly cartIds: CartId[] = [1, 2];

    carts: Record<CartId, CartItem[]> = {
        1: [],
        2: []
    };

    ngOnInit(): void {
        this.restoreCartState();
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading = true;
        this.salesService
            .getProducts({ per_page: 200 })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((res) => {
                this.products = Array.isArray(res?.data)
                    ? res.data.map((item: any) => ({
                          _id: String(item._id),
                          productId: String(item.productId ?? item._id),
                          name: item.name ?? item.productName ?? '-',
                          price: Number(item.price ?? item.productPrice ?? 0),
                          amount: Number(item.amount ?? 0)
                      }))
                    : [];
            });
    }

    get filteredProducts(): SalesProduct[] {
        const term = this.search.trim().toLowerCase();
        if (!term) return this.products;

        const numericTerm = term.replace(/[^\d]/g, '');
        return this.products.filter((product) => {
            const nameMatches = product.name.toLowerCase().includes(term);
            const priceMatches = numericTerm ? String(product.price).includes(numericTerm) : false;
            return nameMatches || priceMatches;
        });
    }

    onSearchChange(value: string): void {
        const rawValue = String(value ?? '');
        const digitsOnly = rawValue.replace(/[\s.,]/g, '');
        const isNumericSearch = /^[\d\s.,]+$/.test(rawValue) && /^\d+$/.test(digitsOnly);

        if (!isNumericSearch) {
            this.search = rawValue;
            return;
        }

        const normalizedDigits = digitsOnly.replace(/^0+(?=\d)/, '');
        this.search = normalizedDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    addToCart(product: SalesProduct): void {
        const available = this.getAvailableAmount(product);
        if (available <= 0) return;

        const cart = this.carts[this.activeCart];
        const existing = cart.find((item) => item.productId === product.productId);

        if (existing) {
            existing.quantity += 1;
            this.saveCartState();
            return;
        }

        cart.push({
            productId: product.productId ?? product._id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
        this.saveCartState();
    }

    increaseItem(cartId: CartId, item: CartItem): void {
        const product = this.products.find((p) => (p.productId ?? p._id) === item.productId);
        if (!product || this.getAvailableAmount(product) <= 0) return;
        item.quantity += 1;
        this.saveCartState();
    }

    decreaseItem(cartId: CartId, item: CartItem): void {
        if (item.quantity <= 1) {
            this.removeItem(cartId, item.productId);
            return;
        }

        item.quantity -= 1;
        this.saveCartState();
    }

    removeItem(cartId: CartId, productId: string): void {
        this.carts[cartId] = this.carts[cartId].filter((item) => item.productId !== productId);
        this.saveCartState();
    }

    clearCart(cartId: CartId): void {
        this.carts[cartId] = [];
        this.saveCartState();
    }

    public confirmClearCart(cartId: CartId): void {
        const itemCount = this.getCartCount(cartId);
        if (!itemCount) return;

        this.confirmationService.confirm({
            key: 'sales-clear',
            header: `Savat ${cartId} ni tozalash`,
            message: `Savatdagi ${itemCount} ta maxsulot olib tashlanadi. Davom etasizmi?`,
            icon: 'pi pi-trash',
            acceptLabel: 'Tozalash',
            rejectLabel: 'Bekor qilish',
            acceptButtonStyleClass: 'confirm-accept-btn',
            rejectButtonStyleClass: 'p-button-outlined confirm-reject-btn',
            accept: () => this.clearCart(cartId)
        });
    }

    public confirmSellCart(cartId: CartId): void {
        const itemCount = this.getCartCount(cartId);
        if (!itemCount || this.sellingCart === cartId) return;

        this.confirmationService.confirm({
            key: 'sales-complete',
            header: 'Sotuvni yakunlash',
            message: `Savat ${cartId} dagi ${itemCount} ta maxsulot ${this.formatMoney(this.getCartTotal(cartId))} ga sotilganini tasdiqlaysizmi?`,
            icon: 'pi pi-check',
            acceptLabel: 'Tasdiqlash',
            rejectLabel: 'Bekor qilish',
            acceptButtonStyleClass: 'form-save-btn',
            rejectButtonStyleClass: 'p-button-outlined confirm-reject-btn',
            accept: () => this.sellCart(cartId)
        });
    }

    sellCart(cartId: CartId): void {
        const cart = this.carts[cartId];
        if (!cart.length) return;

        this.sellingCart = cartId;
        this.salesService
            .sell(cart.map((item) => ({ productId: item.productId, amount: item.quantity })))
            .pipe(finalize(() => (this.sellingCart = null)))
            .subscribe(() => {
                this.toast.success(`Savat ${cartId} sotildi`);
                this.clearCart(cartId);
                this.loadProducts();
            });
    }

    setActiveCart(cartId: CartId): void {
        this.activeCart = cartId;
        sessionStorage.setItem(this.activeCartStorageKey, String(cartId));
    }

    private saveCartState(): void {
        sessionStorage.setItem(this.cartStorageKey, JSON.stringify(this.carts));
    }

    private restoreCartState(): void {
        const storedActiveCart = Number(sessionStorage.getItem(this.activeCartStorageKey));
        if (storedActiveCart === 1 || storedActiveCart === 2) {
            this.activeCart = storedActiveCart;
        }

        const storedCarts = sessionStorage.getItem(this.cartStorageKey);
        if (!storedCarts) return;

        try {
            const parsed = JSON.parse(storedCarts) as Partial<Record<CartId, CartItem[]>>;
            this.carts = {
                1: Array.isArray(parsed[1]) ? parsed[1] : [],
                2: Array.isArray(parsed[2]) ? parsed[2] : []
            };
        } catch {
            sessionStorage.removeItem(this.cartStorageKey);
        }
    }

    getAvailableAmount(product: SalesProduct): number {
        const reserved = this.getReservedAmount(product.productId ?? product._id);
        return Math.max(Number(product.amount ?? 0) - reserved, 0);
    }

    getReservedAmount(productId: string): number {
        return ([1, 2] as CartId[]).reduce((sum, cartId) => {
            const item = this.carts[cartId].find((cartItem) => cartItem.productId === productId);
            return sum + Number(item?.quantity ?? 0);
        }, 0);
    }

    getCartTotal(cartId: CartId): number {
        return this.carts[cartId].reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    getCartCount(cartId: CartId): number {
        return this.carts[cartId].reduce((sum, item) => sum + item.quantity, 0);
    }

    private formatMoney(value: number): string {
        return `UZS ${new Intl.NumberFormat('uz-UZ').format(value)}`;
    }

    trackProduct(_: number, product: SalesProduct): string {
        return product.productId ?? product._id;
    }

    trackCartItem(_: number, item: CartItem): string {
        return item.productId;
    }
}
