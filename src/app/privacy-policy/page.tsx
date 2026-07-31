import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | DCSoftware',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#0B1F4A] mb-2">
          Chính sách bảo mật (Privacy Policy)
        </h1>
        <p className="text-sm text-[#64748B] mb-8">Cập nhật lần cuối: 19/03/2026</p>

        <p className="text-sm md:text-base text-[#1F2933] mb-4">
          Tại <strong>DCSoftware (Digital Century Software)</strong>, chúng tôi tôn trọng và cam kết bảo vệ
          quyền riêng tư của người dùng, khách hàng và đối tác khi truy cập website.
        </p>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-[#0B1F4A]">1. Thông tin chúng tôi thu thập</h2>
          <p className="text-sm md:text-base text-[#1F2933]">
            Chúng tôi có thể thu thập các thông tin sau khi bạn sử dụng website:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-[#1F2933]">
            <li>Họ và tên</li>
            <li>Email</li>
            <li>Số điện thoại</li>
            <li>Tên công ty</li>
            <li>Nội dung liên hệ / yêu cầu tư vấn</li>
            <li>Thông tin kỹ thuật: địa chỉ IP, trình duyệt, thiết bị, hành vi truy cập</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-[#0B1F4A]">2. Mục đích sử dụng thông tin</h2>
          <p className="text-sm md:text-base text-[#1F2933]">Thông tin được sử dụng nhằm:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-[#1F2933]">
            <li>Phản hồi yêu cầu và tư vấn dịch vụ</li>
            <li>Liên hệ trao đổi về dự án, hợp tác</li>
            <li>Cải thiện trải nghiệm người dùng trên website</li>
            <li>Phân tích dữ liệu để tối ưu sản phẩm và marketing</li>
            <li>Gửi thông tin dịch vụ (nếu bạn đồng ý)</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-[#0B1F4A]">3. Chia sẻ thông tin</h2>
          <p className="text-sm md:text-base text-[#1F2933]">
            DCSoftware <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của bạn.
          </p>
          <p className="text-sm md:text-base text-[#1F2933]">Chúng tôi chỉ chia sẻ thông tin trong các trường hợp:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-[#1F2933]">
            <li>Với các đối tác hỗ trợ vận hành hệ thống (hosting, email, analytics,...)</li>
            <li>Khi có yêu cầu từ cơ quan pháp luật</li>
            <li>Khi cần thiết để bảo vệ quyền lợi hợp pháp của công ty</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-[#0B1F4A]">4. Bảo mật thông tin</h2>
          <p className="text-sm md:text-base text-[#1F2933]">
            Chúng tôi áp dụng các biện pháp bảo mật phù hợp:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-[#1F2933]">
            <li>Sử dụng HTTPS/SSL để mã hóa dữ liệu</li>
            <li>Hạn chế quyền truy cập nội bộ</li>
            <li>Lưu trữ dữ liệu trên hệ thống an toàn</li>
          </ul>
          <p className="text-sm md:text-base text-[#1F2933]">
            Tuy nhiên, không có phương thức truyền tải hoặc lưu trữ nào đảm bảo an toàn tuyệt đối.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-[#0B1F4A]">5. Cookies</h2>
          <p className="text-sm md:text-base text-[#1F2933]">Website có thể sử dụng cookies để:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-[#1F2933]">
            <li>Ghi nhớ tùy chọn người dùng</li>
            <li>Phân tích hành vi truy cập</li>
            <li>Cải thiện trải nghiệm</li>
          </ul>
          <p className="text-sm md:text-base text-[#1F2933]">
            Bạn có thể tắt cookies trong trình duyệt, nhưng một số tính năng có thể bị ảnh hưởng.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-[#0B1F4A]">6. Liên kết bên thứ ba</h2>
          <p className="text-sm md:text-base text-[#1F2933]">
            Website có thể chứa liên kết đến các website khác. DCSoftware không chịu trách nhiệm về nội dung hoặc
            chính sách bảo mật của các bên thứ ba này.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-[#0B1F4A]">7. Quyền của bạn</h2>
          <p className="text-sm md:text-base text-[#1F2933]">Bạn có quyền:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-[#1F2933]">
            <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân</li>
            <li>Từ chối nhận thông tin marketing</li>
            <li>Yêu cầu ngừng xử lý dữ liệu của bạn</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-[#0B1F4A]">8. Liên hệ</h2>
          <p className="text-sm md:text-base text-[#1F2933]">
            Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật, vui lòng liên hệ:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-[#1F2933]">
            <li>Email: digitalcenturysoftware@gmail.com</li>
            <li>
              Address: Tầng 18 Tòa nhà CEO Lô HH2-1 KĐT Mễ Trì Hạ, Đường Phạm Hùng, Phường Từ Liêm, TP Hà Nội, Việt Nam
            </li>
          </ul>
        </section>

        <p className="mt-10 text-sm md:text-base text-[#1F2933]">
          DCSoftware có thể cập nhật Chính sách bảo mật này theo thời gian. Mọi thay đổi sẽ được đăng tải trên website.
        </p>
      </div>
    </main>
  )
}

