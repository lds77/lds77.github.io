<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>직지응급환자이송단 - 신뢰할 수 있는 응급환자 이송 서비스</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header */
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2c3e50;
            text-decoration: none;
        }

        .emergency-badge {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* Hero Section */
        .hero {
            padding: 4rem 0;
            text-align: center;
            color: white;
        }

        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.95;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(45deg, #27ae60, #2ecc71);
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(46, 204, 113, 0.4);
        }

        /* Main Content */
        .main-content {
            background: white;
            margin: -2rem 0 0 0;
            border-radius: 30px 30px 0 0;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
        }

        .section {
            padding: 4rem 0;
        }

        .section h2 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: #2c3e50;
            position: relative;
        }

        .section h2::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: linear-gradient(45deg, #3498db, #2980b9);
            margin: 1rem auto;
            border-radius: 2px;
        }

        /* Services Grid */
        .services {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .service-card {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(52, 152, 219, 0.1);
        }

        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
        }

        .service-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .service-card h3 {
            font-size: 1.4rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }

        .service-card p {
            color: #7f8c8d;
            line-height: 1.8;
        }

        /* About Section */
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
        }

        .about-text {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #555;
        }

        .about-features {
            background: linear-gradient(135deg, #74b9ff, #0984e3);
            padding: 2rem;
            border-radius: 20px;
            color: white;
        }

        .feature-list {
            list-style: none;
        }

        .feature-list li {
            padding: 0.8rem 0;
            position: relative;
            padding-left: 2rem;
        }

        .feature-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #00d2d3;
            font-weight: bold;
            font-size: 1.2rem;
        }

        /* Contact Section */
        .contact {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            margin-top: 4rem;
        }

        .contact-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 3rem;
        }

        .contact-info {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }

        .contact-info h3 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #ecf0f1;
        }

        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }

        .contact-item i {
            margin-right: 1rem;
            font-size: 1.3rem;
            color: #3498db;
        }

        .phone-number {
            font-size: 2rem;
            font-weight: 700;
            color: #e74c3c;
            text-decoration: none;
            display: block;
            margin-top: 1rem;
            text-align: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            transition: all 0.3s ease;
        }

        .phone-number:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.02);
        }

        /* Footer */
        .footer {
            background: #1a1a1a;
            color: #bbb;
            text-align: center;
            padding: 2rem 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero p {
                font-size: 1.1rem;
            }

            .about-content {
                grid-template-columns: 1fr;
            }

            .section h2 {
                font-size: 2rem;
            }

            .nav {
                flex-direction: column;
                gap: 1rem;
            }

            .logo {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav container">
            <a href="#" class="logo">직지응급환자이송단</a>
            <div class="emergency-badge">24시간 응급 이송</div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>생명을 구하는 신속한 이송</h1>
            <p>충북 청주 지역 최고의 사설구급차 서비스를 제공합니다</p>
            <a href="tel:010-8841-4114" class="cta-button">긴급 연락하기</a>
        </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Services Section -->
        <section class="section container">
            <h2>전문 이송 서비스</h2>
            <div class="services">
                <div class="service-card">
                    <div class="service-icon">🚑</div>
                    <h3>응급환자 이송</h3>
                    <p>24시간 대기하며 응급상황 발생 시 신속하고 안전한 병원 이송 서비스를 제공합니다.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">🏥</div>
                    <h3>병원간 전원</h3>
                    <p>의료진 동반하여 병원 간 안전한 환자 전원 서비스를 전문적으로 수행합니다.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">👨‍⚕️</div>
                    <h3>의료진 동반</h3>
                    <p>숙련된 응급구조사가 동반하여 이송 중 환자의 안전을 최우선으로 관리합니다.</p>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section class="section container">
            <h2>회사 소개</h2>
            <div class="about-content">
                <div class="about-text">
                    <p><strong>직지응급환자이송단</strong>은 충북 청주 지역에서 신뢰받는 사설구급차 서비스를 제공하는 전문 업체입니다.</p>
                    
                    <p>우리는 환자의 생명과 안전을 최우선으로 하며, 24시간 언제든지 신속하고 정확한 응급 이송 서비스를 제공합니다. 숙련된 응급구조사와 최신 의료 장비를 갖춘 구급차로 환자의 상태에 맞는 최적의 이송 서비스를 제공하고 있습니다.</p>

                    <p>긴급한 상황에서도 침착하고 전문적인 대응으로 환자와 가족의 든든한 동반자가 되겠습니다.</p>
                </div>
                <div class="about-features">
                    <h3>우리의 강점</h3>
                    <ul class="feature-list">
                        <li>24시간 응급 대기 서비스</li>
                        <li>숙련된 응급구조사 동반</li>
                        <li>최신 의료 장비 완비</li>
                        <li>신속한 출동 시스템</li>
                        <li>합리적인 이송 비용</li>
                        <li>충북 청주 지역 전문 서비스</li>
                    </ul>
                </div>
            </div>
        </section>
    </main>

    <!-- Contact Section -->
    <section class="contact section">
        <div class="container">
            <h2 style="color: white;">연락처 정보</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <h3>대표자 정보</h3>
                    <div class="contact-item">
                        <i>👤</i>
                        <span>대표: 강경성</span>
                    </div>
                    <div class="contact-item">
                        <i>📍</i>
                        <span>서비스 지역: 충북 청주시</span>
                    </div>
                    <div class="contact-item">
                        <i>⏰</i>
                        <span>운영시간: 24시간 대기</span>
                    </div>
                </div>
                <div class="contact-info">
                    <h3>긴급 연락처</h3>
                    <p style="margin-bottom: 1rem;">응급상황 발생 시 언제든지 연락주세요</p>
                    <a href="tel:010-8841-4114" class="phone-number">010-8841-4114</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 직지응급환자이송단. 생명을 구하는 신속한 이송 서비스.</p>
        </div>
    </footer>
</body>
</html>
