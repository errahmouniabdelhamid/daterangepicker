/**
 * DOM utility functions to replace jQuery
 */

export class DOMUtils {
  /**
   * Query selector - returns first matching element
   */
  static query(selector: string, parent: Element | Document = document): Element | null {
    return parent.querySelector(selector);
  }

  /**
   * Query selector all - returns all matching elements
   */
  static queryAll(selector: string, parent: Element | Document = document): Element[] {
    return Array.from(parent.querySelectorAll(selector));
  }

  /**
   * Add class to element
   */
  static addClass(element: Element, ...classes: string[]): void {
    element.classList.add(...classes);
  }

  /**
   * Remove class from element
   */
  static removeClass(element: Element, ...classes: string[]): void {
    element.classList.remove(...classes);
  }

  /**
   * Toggle class on element
   */
  static toggleClass(element: Element, className: string): void {
    element.classList.toggle(className);
  }

  /**
   * Check if element has class
   */
  static hasClass(element: Element, className: string): boolean {
    return element.classList.contains(className);
  }

  /**
   * Create element from HTML string
   */
  static createElement(html: string): Element {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild!;
  }

  /**
   * Append child to parent
   */
  static append(parent: Element, child: Element): void {
    parent.appendChild(child);
  }

  /**
   * Remove element from DOM
   */
  static remove(element: Element): void {
    element.parentNode?.removeChild(element);
  }

  /**
   * Get/Set attribute
   */
  static attr(element: Element, name: string, value?: string): string | null {
    if (value !== undefined) {
      element.setAttribute(name, value);
      return value;
    }
    return element.getAttribute(name);
  }

  /**
   * Get/Set data attribute
   */
  static data(element: Element, key: string, value?: any): any {
    const dataKey = `data-${key}`;
    if (value !== undefined) {
      (element as any)[dataKey] = value;
      return value;
    }
    return (element as any)[dataKey];
  }

  /**
   * Get/Set HTML content
   */
  static html(element: Element, content?: string): string {
    if (content !== undefined) {
      element.innerHTML = content;
      return content;
    }
    return element.innerHTML;
  }

  /**
   * Get/Set text content
   */
  static text(element: Element, content?: string): string {
    if (content !== undefined) {
      element.textContent = content;
      return content;
    }
    return element.textContent || '';
  }

  /**
   * Get/Set input value
   */
  static val(element: HTMLInputElement | HTMLSelectElement, value?: string): string {
    if (value !== undefined) {
      element.value = value;
      return value;
    }
    return element.value;
  }

  /**
   * Add event listener
   */
  static on(
    element: Element | Document,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options);
  }

  /**
   * Remove event listener
   */
  static off(
    element: Element | Document,
    event: string,
    handler: EventListener,
    options?: EventListenerOptions
  ): void {
    element.removeEventListener(event, handler, options);
  }

  /**
   * Trigger custom event
   */
  static trigger(element: Element, eventName: string, detail?: any): void {
    const event = new CustomEvent(eventName, { detail, bubbles: true, cancelable: true });
    element.dispatchEvent(event);
  }

  /**
   * Show element
   */
  static show(element: HTMLElement): void {
    element.style.display = 'block';
  }

  /**
   * Hide element
   */
  static hide(element: HTMLElement): void {
    element.style.display = 'none';
  }

  /**
   * Check if element is input
   */
  static isInput(element: Element): element is HTMLInputElement {
    return element.tagName === 'INPUT';
  }

  /**
   * Check if element is button
   */
  static isButton(element: Element): element is HTMLButtonElement {
    return element.tagName === 'BUTTON';
  }

  /**
   * Get closest parent matching selector
   */
  static closest(element: Element, selector: string): Element | null {
    return element.closest(selector);
  }

  /**
   * Find child element
   */
  static find(parent: Element, selector: string): Element | null {
    return parent.querySelector(selector);
  }

  /**
   * Find all child elements
   */
  static findAll(parent: Element, selector: string): Element[] {
    return Array.from(parent.querySelectorAll(selector));
  }
}
