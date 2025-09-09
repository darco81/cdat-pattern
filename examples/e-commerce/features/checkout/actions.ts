/**
 * Checkout Feature - Actions Layer
 * @layer Actions (A in CDAT)
 */

import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../utils/Cdat';
import { CheckoutComponents } from './components';
import type { ContactInfo, ShippingAddress, PaymentInfo, CheckoutData } from './data';
import { ShippingMethod } from './data';

export class CheckoutActions {
  private readonly components: CheckoutComponents;

  constructor(private readonly page: Page) {
    this.components = new CheckoutComponents(page);
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────

  async navigateToCheckout(): Promise<void> {
    await this.page.goto('/checkout');
    await Cdat.waitForState(this.components.form, LocatorState.Visible);
  }

  async backToCart(): Promise<void> {
    await Cdat.waitAndClick(this.components.backToCartLink);
  }

  // ─────────────────────────────────────────────────────────────────
  // ATOMIC ACTIONS - Contact
  // ─────────────────────────────────────────────────────────────────

  async fillEmail(email: string): Promise<void> {
    await Cdat.waitAndFill(this.components.emailField, email);
  }

  async fillPhone(phone: string): Promise<void> {
    await Cdat.waitAndFill(this.components.phoneField, phone);
  }

  // ─────────────────────────────────────────────────────────────────
  // ATOMIC ACTIONS - Shipping
  // ─────────────────────────────────────────────────────────────────

  async fillFirstName(firstName: string): Promise<void> {
    await Cdat.waitAndFill(this.components.firstNameField, firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await Cdat.waitAndFill(this.components.lastNameField, lastName);
  }

  async fillAddress(address: string): Promise<void> {
    await Cdat.waitAndFill(this.components.addressField, address);
  }

  async fillCity(city: string): Promise<void> {
    await Cdat.waitAndFill(this.components.cityField, city);
  }

  async fillState(state: string): Promise<void> {
    await Cdat.waitAndFill(this.components.stateField, state);
  }

  async fillZipCode(zipCode: string): Promise<void> {
    await Cdat.waitAndFill(this.components.zipCodeField, zipCode);
  }

  async selectCountry(country: string): Promise<void> {
    await Cdat.waitAndSelect(this.components.countryField, country);
  }

  // ─────────────────────────────────────────────────────────────────
  // ATOMIC ACTIONS - Payment
  // ─────────────────────────────────────────────────────────────────

  async fillCardNumber(cardNumber: string): Promise<void> {
    await Cdat.waitAndFill(this.components.cardNumber, cardNumber);
  }

  async fillCardExpiry(expiry: string): Promise<void> {
    await Cdat.waitAndFill(this.components.cardExpiry, expiry);
  }

  async fillCardCvc(cvc: string): Promise<void> {
    await Cdat.waitAndFill(this.components.cardCvc, cvc);
  }

  async fillCardName(name: string): Promise<void> {
    await Cdat.waitAndFill(this.components.cardName, name);
  }

  // ─────────────────────────────────────────────────────────────────
  // COMPOSED ACTIONS (Method Composition)
  // ─────────────────────────────────────────────────────────────────

  async fillContactInfo(contact: ContactInfo): Promise<void> {
    await this.fillEmail(contact.email);
    await this.fillPhone(contact.phone);
  }

  async fillShippingAddress(address: ShippingAddress): Promise<void> {
    await this.fillFirstName(address.firstName);
    await this.fillLastName(address.lastName);
    await this.fillAddress(address.address);
    await this.fillCity(address.city);
    await this.fillState(address.state);
    await this.fillZipCode(address.zipCode);
    await this.selectCountry(address.country);
  }

  async fillPaymentInfo(payment: PaymentInfo): Promise<void> {
    await this.fillCardNumber(payment.cardNumber);
    await this.fillCardExpiry(payment.expiry);
    await this.fillCardCvc(payment.cvc);
    await this.fillCardName(payment.cardName);
  }

  async selectShippingMethod(method: ShippingMethod): Promise<void> {
    if (method === ShippingMethod.Express) {
      await Cdat.waitAndClick(this.components.expressShipping);
      return;
    }

    await Cdat.waitAndClick(this.components.standardShipping);
  }

  /**
   * Complete full checkout as guest
   * (Composed action - DRY, reusable flow)
   */
  async completeCheckoutAsGuest(data: CheckoutData): Promise<void> {
    await this.fillContactInfo(data.contact);
    await this.fillShippingAddress(data.shipping);
    await this.fillPaymentInfo(data.payment);
    await this.placeOrder();
  }

  /**
   * Complete checkout as logged-in user
   * (Composed action - skips contact info, uses saved address)
   */
  async completeCheckoutAsUser(payment: PaymentInfo): Promise<void> {
    // Contact and shipping already pre-filled for logged-in users
    await this.fillPaymentInfo(payment);
    await this.placeOrder();
  }

  async placeOrder(): Promise<void> {
    await Cdat.waitAndClick(this.components.placeOrderButton);
  }

  // ─────────────────────────────────────────────────────────────────
  // STATE GETTERS
  // ─────────────────────────────────────────────────────────────────

  async getOrderNumber(): Promise<string> {
    return Cdat.waitForText(this.components.orderNumber);
  }

  async getOrderTotal(): Promise<number> {
    const text = await Cdat.waitForText(this.components.orderTotal);
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async isOrderSuccessful(): Promise<boolean> {
    return Cdat.checkState(this.components.successMessage, LocatorState.Visible);
  }

  async getErrorMessage(): Promise<string> {
    const isVisible = await Cdat.checkState(
      this.components.errorMessage,
      LocatorState.Visible
    );
    if (!isVisible) {
      return '';
    }
    return Cdat.waitForText(this.components.errorMessage);
  }

  async getFieldError(fieldName: string): Promise<string> {
    const error = this.components.getFieldError(fieldName);
    const isVisible = await Cdat.checkState(error, LocatorState.Visible);
    if (!isVisible) {
      return '';
    }
    return Cdat.waitForText(error);
  }
}
