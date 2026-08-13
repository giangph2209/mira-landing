# Ảnh nền case study

Panel trái của mỗi case study trong `src/components/sections/CaseStudiesSection.tsx`
dùng ảnh theo đúng tên file dưới đây. Thiếu file nào thì case đó tự rơi về gradient
dự phòng (`tone`), layout không vỡ.

| File                          | Case study                          | Chủ đề gợi ý                                              |
| ----------------------------- | ----------------------------------- | --------------------------------------------------------- |
| `lifecycle.webp`              | 01 — Lifecycle                      | Thành phố thông minh, hạ tầng đô thị, icon tiện ích        |
| `food-waste.webp`             | 02 — Giảm lãng phí thực phẩm        | Thực phẩm tươi, siêu thị/cửa hàng, chuỗi cung ứng          |
| `business-chat.webp`          | 03 — Business Chat & Call           | Giao tiếp doanh nghiệp, chat/call, không gian làm việc     |
| `toy-label.webp`              | 04 — Toy Label Management           | Sản phẩm đồ chơi, nhãn/barcode, kho hàng                   |
| `accessibility-support.webp`  | 05 — Hỗ trợ người yếu thế           | Tiếp cận dịch vụ, hỗ trợ cộng đồng, thiết bị dễ sử dụng    |

Quy cách:

- Tỉ lệ dọc (portrait), khoảng **1080 × 1440 px** — panel cao và hẹp trên desktop,
  thành dải ngang trên mobile nên chủ thể cần nằm giữa khung.
- Định dạng `.webp`, dung lượng < 300 KB.
- Ảnh sẽ bị phủ một lớp gradient tối (`from-black/85`) để chữ trắng đọc được,
  nên chọn ảnh sáng, ít chi tiết dày ở nửa dưới.
