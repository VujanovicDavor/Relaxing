import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MoodExplanationPopoverPage } from './mood-explanation-popover.page';

describe('MoodExplanationPopoverPage', () => {
  let component: MoodExplanationPopoverPage;
  let fixture: ComponentFixture<MoodExplanationPopoverPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MoodExplanationPopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MoodExplanationPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
