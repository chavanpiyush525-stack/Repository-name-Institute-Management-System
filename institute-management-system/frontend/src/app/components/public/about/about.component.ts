import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="container">
        <div class="hero-content">
          <h1>About Excellence Institute</h1>
          <p class="hero-subtitle">Empowering minds and shaping futures since 2010</p>
          <p class="hero-description">
            We are a leading educational institution dedicated to providing world-class education 
            and fostering innovation in technology, business, and creative fields.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission & Vision Section -->
    <section class="mission-vision-section">
      <div class="container">
        <div class="mission-vision-grid">
          <div class="mission-card">
            <div class="card-icon">
              <mat-icon>rocket_launch</mat-icon>
            </div>
            <h2>Our Mission</h2>
            <p>
              To provide world-class education and create leaders of tomorrow through innovative 
              teaching methods, comprehensive skill development, and fostering a culture of 
              continuous learning and excellence.
            </p>
          </div>
          
          <div class="vision-card">
            <div class="card-icon">
              <mat-icon>visibility</mat-icon>
            </div>
            <h2>Our Vision</h2>
            <p>
              To be the leading educational institution that transforms lives and contributes to 
              society's progress by nurturing innovative thinkers, skilled professionals, and 
              responsible global citizens.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <div class="section-header">
          <h2>Our Core Values</h2>
          <p>The principles that guide everything we do</p>
        </div>
        
        <div class="values-grid">
          <div class="value-card" *ngFor="let value of values">
            <div class="value-icon">
              <mat-icon>{{ value.icon }}</mat-icon>
            </div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <div class="section-header">
          <h2>Meet Our Leadership Team</h2>
          <p>Experienced professionals dedicated to your success</p>
        </div>
        
        <div class="team-grid">
          <div class="team-member" *ngFor="let member of teamMembers">
            <div class="member-photo">
              <mat-icon>{{ member.icon }}</mat-icon>
            </div>
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <p class="member-title">{{ member.title }}</p>
              <p class="member-bio">{{ member.bio }}</p>
              <div class="member-expertise">
                <span *ngFor="let skill of member.expertise" class="expertise-tag">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="statistics-section">
      <div class="container">
        <div class="section-header">
          <h2>Our Impact in Numbers</h2>
          <p>Measurable results that speak for themselves</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item" *ngFor="let stat of statistics">
            <div class="stat-icon">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-description">{{ stat.description }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- History Timeline -->
    <section class="history-section">
      <div class="container">
        <div class="section-header">
          <h2>Our Journey</h2>
          <p>Milestones in our educational excellence</p>
        </div>
        
        <div class="timeline">
          <div class="timeline-item" *ngFor="let event of timeline; let i = index" 
               [class.timeline-left]="i % 2 === 0" [class.timeline-right]="i % 2 === 1">
            <div class="timeline-content">
              <div class="timeline-year">{{ event.year }}</div>
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Join Our Community?</h2>
          <p>Become part of our success story and transform your future with us</p>
          <div class="cta-actions">
            <button mat-raised-button color="primary" routerLink="/courses" class="cta-button">
              <mat-icon>school</mat-icon>
              Explore Courses
            </button>
            <button mat-button routerLink="/contact" class="secondary-button">
              <mat-icon>contact_mail</mat-icon>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Hero Section */
    .about-hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 0;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin: 0 0 20px 0;
      font-family: 'Poppins', sans-serif;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin: 0 0 30px 0;
      opacity: 0.9;
      font-weight: 300;
    }

    .hero-description {
      font-size: 1.2rem;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      opacity: 0.8;
    }

    /* Mission & Vision Section */
    .mission-vision-section {
      padding: 100px 0;
      background: #f8f9ff;
    }

    .mission-vision-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }

    .mission-card,
    .vision-card {
      text-align: center;
      padding: 50px 40px;
      background: white;
      border-radius: 25px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .mission-card:hover,
    .vision-card:hover {
      transform: translateY(-10px);
    }

    .card-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 30px auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .card-icon mat-icon {
      font-size: 3rem !important;
      width: 3rem !important;
      height: 3rem !important;
    }

    .mission-card h2,
    .vision-card h2 {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 25px 0;
    }

    .mission-card p,
    .vision-card p {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #666;
      margin: 0;
    }

    /* Values Section */
    .values-section {
      padding: 100px 0;
      background: white;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 20px 0;
      font-family: 'Poppins', sans-serif;
    }

    .section-header p {
      font-size: 1.2rem;
      color: #666;
      margin: 0;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
    }

    .value-card {
      text-align: center;
      padding: 40px 30px;
      background: #f8f9ff;
      border-radius: 20px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .value-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      background: white;
    }

    .value-icon {
      width: 70px;
      height: 70px;
      margin: 0 auto 25px auto;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .value-icon mat-icon {
      font-size: 2rem !important;
      width: 2rem !important;
      height: 2rem !important;
    }

    .value-card h3 {
      font-size: 1.4rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px 0;
    }

    .value-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* Team Section */
    .team-section {
      padding: 100px 0;
      background: #f8f9ff;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 40px;
    }

    .team-member {
      background: white;
      border-radius: 20px;
      padding: 40px 30px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .team-member:hover {
      transform: translateY(-5px);
    }

    .member-photo {
      width: 120px;
      height: 120px;
      margin: 0 auto 25px auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .member-photo mat-icon {
      font-size: 3.5rem !important;
      width: 3.5rem !important;
      height: 3.5rem !important;
    }

    .member-info h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px 0;
    }

    .member-title {
      font-size: 1.1rem;
      color: #667eea;
      font-weight: 500;
      margin: 0 0 20px 0;
    }

    .member-bio {
      color: #666;
      line-height: 1.6;
      margin: 0 0 25px 0;
    }

    .member-expertise {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }

    .expertise-tag {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    /* Statistics Section */
    .statistics-section {
      padding: 100px 0;
      background: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
    }

    .stat-item {
      text-align: center;
      padding: 40px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      transition: transform 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px auto;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 1.8rem !important;
      width: 1.8rem !important;
      height: 1.8rem !important;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 10px;
      font-family: 'Poppins', sans-serif;
    }

    .stat-label {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .stat-description {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    /* History Timeline */
    .history-section {
      padding: 100px 0;
      background: #f8f9ff;
    }

    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transform: translateX(-50%);
    }

    .timeline-item {
      position: relative;
      margin-bottom: 50px;
    }

    .timeline-content {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      position: relative;
      width: 45%;
    }

    .timeline-left .timeline-content {
      margin-right: auto;
    }

    .timeline-right .timeline-content {
      margin-left: auto;
    }

    .timeline-year {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 15px;
    }

    .timeline-content h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 15px 0;
    }

    .timeline-content p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* CTA Section */
    .cta-section {
      padding: 100px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 20px 0;
      font-family: 'Poppins', sans-serif;
    }

    .cta-content p {
      font-size: 1.2rem;
      margin: 0 0 40px 0;
      opacity: 0.9;
    }

    .cta-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-button,
    .secondary-button {
      padding: 12px 32px !important;
      font-size: 1.1rem !important;
      border-radius: 25px !important;
      font-weight: 600 !important;
      text-transform: none !important;
    }

    .secondary-button {
      border: 2px solid rgba(255,255,255,0.3) !important;
      color: white !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }

      .mission-vision-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .values-grid,
      .team-grid,
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .timeline::before {
        left: 20px;
      }

      .timeline-content {
        width: calc(100% - 60px);
        margin-left: 60px !important;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .cta-button,
      .secondary-button {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class AboutComponent {
  values = [
    {
      icon: 'school',
      title: 'Excellence in Education',
      description: 'We strive for the highest standards in teaching and learning, ensuring every student receives world-class education.'
    },
    {
      icon: 'lightbulb',
      title: 'Innovation',
      description: 'We embrace new technologies and teaching methods to provide cutting-edge learning experiences.'
    },
    {
      icon: 'diversity_3',
      title: 'Inclusivity',
      description: 'We welcome students from all backgrounds and create an environment where everyone can thrive.'
    },
    {
      icon: 'handshake',
      title: 'Integrity',
      description: 'We maintain the highest ethical standards in all our interactions and educational practices.'
    },
    {
      icon: 'psychology',
      title: 'Student-Centered',
      description: 'Every decision we make is focused on enhancing the student experience and success.'
    },
    {
      icon: 'public',
      title: 'Global Perspective',
      description: 'We prepare students for success in an interconnected world with international standards.'
    }
  ];

  teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Founder & CEO',
      bio: 'With over 20 years in education and technology, Dr. Johnson leads our vision of transforming lives through quality education.',
      expertise: ['Educational Leadership', 'Technology Integration', 'Curriculum Development'],
      icon: 'person'
    },
    {
      name: 'Prof. Michael Chen',
      title: 'Academic Director',
      bio: 'Former MIT professor with expertise in computer science and data analytics, ensuring our curriculum stays cutting-edge.',
      expertise: ['Computer Science', 'Data Analytics', 'Research'],
      icon: 'person'
    },
    {
      name: 'Emily Rodriguez',
      title: 'Student Success Manager',
      bio: 'Dedicated to ensuring every student achieves their goals through personalized support and career guidance.',
      expertise: ['Student Support', 'Career Counseling', 'Program Management'],
      icon: 'person'
    }
  ];

  statistics = [
    {
      icon: 'people',
      number: '5,000+',
      label: 'Graduates',
      description: 'Successful alumni worldwide'
    },
    {
      icon: 'school',
      number: '50+',
      label: 'Courses',
      description: 'Comprehensive programs'
    },
    {
      icon: 'work',
      number: '95%',
      label: 'Job Placement',
      description: 'Within 6 months of graduation'
    },
    {
      icon: 'star',
      number: '4.9/5',
      label: 'Student Rating',
      description: 'Average satisfaction score'
    }
  ];

  timeline = [
    {
      year: '2010',
      title: 'Foundation',
      description: 'Excellence Institute was founded with a vision to provide world-class education in technology and business.'
    },
    {
      year: '2013',
      title: 'First Campus',
      description: 'Opened our flagship campus with state-of-the-art facilities and modern learning environments.'
    },
    {
      year: '2016',
      title: 'Online Platform Launch',
      description: 'Launched our comprehensive online learning platform, making education accessible globally.'
    },
    {
      year: '2019',
      title: 'Industry Partnerships',
      description: 'Established partnerships with leading tech companies for internships and job placements.'
    },
    {
      year: '2022',
      title: 'AI Integration',
      description: 'Integrated AI-powered learning tools to personalize education for each student.'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanding to serve students worldwide with localized programs and support.'
    }
  ];
}