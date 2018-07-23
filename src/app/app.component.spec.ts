import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from './app.module';

describe('AppComponent', () => {

    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent], // declare the test component,
            imports: [
                RouterTestingModule
            ]
        });

        fixture = TestBed.createComponent(AppComponent);

        comp = fixture.componentInstance; // AppComponent test instance

    });

    it('should initialized app title with "Vetahealth"', () => {
        expect(comp.title).toBe('Vetahealth');
    });

});