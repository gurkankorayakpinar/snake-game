# Yılan oyunu

- Bu proje, browser üzerinde çalışan ve "auto pilot" özelliği bulunan bir yılan oyunudur.

***

- Oyun alanı "60 x 40" olarak belirlenmiş olup, toplam 2400 karedir.

- Yılan, duvarlardan ve kendi kuyruğu üzerinden geçebilmektedir.

- Oyun alanında rastgele bir şekilde ortaya çıkan yemlerin, yılanın kuyruğu üzerinde oluşmaları engellenmiştir.

- Yılanın uzunluğu, sol üst köşede görülebilmektedir.

- Yılanın başlangıç uzunluğu 1 karedir.

- Uzunluk 800 olduğunda (oyun alanının 3'te 1'i) oyun biter.

- Mouse "sağ tık" ile menü açma özelliği devre dışı bırakılmıştır.

***

# Auto pilot

- "A" veya "a" tuşuna basıldığında, "auto pilot" açılır.

- Sağ üst köşede, auto pilot sisteminin açık veya kapalı olduğu bilgisi mevcuttur.

- Auto pilot, bir sonraki hedefe (dik açılar oluşturarak) ulaşabileceği en kısa mesafe için BFS (Breadth First Search) algoritmasını kullanmaktadır.

- Auto pilot kullanılırken "yön tuşları" kullanılamaz.

***
***
***

# Düzeltilecek veya eklenecek özellikler

- Auto pilot kullanılırken yılanın duvarlardan geçmesi sağlanacak.