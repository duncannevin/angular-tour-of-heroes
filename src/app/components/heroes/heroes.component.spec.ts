import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { of, Observable } from 'rxjs'
import { By } from '@angular/platform-browser'

import { HeroesComponent } from './heroes.component'
import { FooPipe } from 'src/app/pipes/foo.pipe'
import { Hero } from '../../entities/hero'
import { HeroService } from '../../services/hero.service'

const mockData: Hero[] = [
  { id: 1, name: 'one'},
  { id: 2, name: 'two'},
  { id: 3, name: 'three'}
] as Hero[]

fdescribe('HeroesComponent', () => {
  let component: HeroesComponent
  let fixture: ComponentFixture<HeroesComponent>
  let heroService
  let getHeroesSpy

  const formBuilder: FormBuilder = new FormBuilder()

  beforeEach(async(() => {
    // mock and spy on heroService, specifically 'getHeroes'
    heroService = jasmine.createSpyObj('HeroService', [
      'getHeroes', 
      'addHero',
      'deleteHero',
      'newHero'
    ])
    // use mock data with heroService
    getHeroesSpy = heroService.getHeroes.and.returnValue( of(mockData) )

    TestBed.configureTestingModule({
      declarations: [ HeroesComponent, FooPipe ],
      imports: [ 
        RouterTestingModule.withRoutes([]), 
        HttpClientTestingModule, 
        FormsModule, 
        ReactiveFormsModule 
      ],
      providers: [
        { provide: HeroService, useValue: heroService }
      ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  // test that the header is correct
  it('should have h2 tag that says "My Heroes"', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual('My Heroes')
  })

  // test that all the mock heroes are rendered
  it('should render 3 heroes', () => {
    expect(fixture.nativeElement.querySelectorAll('.heroes > li').length).toEqual(3)
  })

  it('should call "add" method when add form is submited', fakeAsync(() => {
    fixture.detectChanges()
    spyOn(component, 'add')
    component.newHero.controls['firstName'].setValue('tester')
    component.newHero.controls['lastName'].setValue('chester')
    fixture.debugElement.nativeElement.querySelector('#add-hero__submit').click()    
    tick()
    fixture.detectChanges()
    expect(component.add).toHaveBeenCalled()
  }))

  it('should call "delete" method when delete button is clicked', fakeAsync(() => {
    fixture.detectChanges()
    spyOn(component, 'delete')
    fixture.debugElement.nativeElement.querySelector('.delete').click()
    tick()
    fixture.detectChanges()
    expect(component.delete).toHaveBeenCalled()
  }))
})
