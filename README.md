BusX UI - Otobüs Biletleme Platformu
BusX UI, kullanıcıların şehirlerarası otobüs seferlerini sorgulayabileceği, interaktif koltuk seçimi yapabileceği ve bilet satın alabileceği modern bir web arayüzüdür. ASP.NET Core (.NET 8) backend servisi ile haberleşecek şekilde tasarlanmıştır.

Teknoloji Yığını (Tech Stack)
Bu proje aşağıdaki kütüphane ve desenler kullanılarak geliştirilmiştir:

React (Vite): Hızlı geliştirme ortamı ve SPA performansı için.

Shadcn UI: Erişilebilir, özelleştirilebilir ve profesyonel UI bileşenleri (Radix UI tabanlı).

Tailwind CSS: Hızlı ve esnek stillendirme için.

Lucide React: Modern, hafif ve tutarlı ikon seti.

Context API: Global durum yönetimi (Rezervasyon akışı, seçilen koltuklar ve kullanıcı oturumu) için.

Axios: Backend API ile haberleşme, interceptor yapısı ve hata yönetimi için.

Proje Özellikleri

Gelişmiş Sefer Arama: Kalkış ve varış noktasına göre tarih bazlı sefer listeleme.

İnteraktif Koltuk Seçimi:

Dolu/Boş koltuk durumu.

Cinsiyet kuralı kontrolleri (Kadın yanı/Erkek yanı).

Rezervasyon Yönetimi (Context API):

Maksimum 4 koltuk sınırı kontrolü.


Kurulum ve Çalıştırma
Projeyi yerel ortamınızda ayağa kaldırmak için aşağıdaki adımları izleyin.

Ön Gereksinimler
Node.js (v18 veya üzeri)
npm veya yarn

1. Projeyi Klonlayın

2. Bağımlılıkları Yükleyin
npm install
# veya
yarn install

3. Uygulamayı Başlatın

npm run dev
Uygulama http://localhost:5173 (veya terminalde belirtilen port) adresinde çalışacaktır.
