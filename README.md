# Yılan oyunu

- Bu proje, browser üzerinde çalışan ve "auto pilot" özelliği bulunan bir yılan oyunudur.

***

- Oyun alanı "49 x 29" olarak belirlenmiştir. (BFS algoritmasının duvarlardan geçerken doğru çalışması için tek sayılar tercih edilmiştir.)

- Yılan, duvarlardan ve kendi kuyruğu üzerinden geçebilmektedir.

- Yılan, tek hamlede 180 derece geriye dönebilmektedir.

- Oyun alanında rastgele bir şekilde ortaya çıkan yemlerin, yılanın kuyruğu üzerinde oluşmaları engellenmiştir.

- Yılanın uzunluğu, sol üst köşede görülebilmektedir. (Başlangıç uzunluğu 1 birimdir.)

- Yılanın uzunluğu 356 birim olduğunda oyun biter.

- Mouse "sağ tık" ile menü açma özelliği devre dışı bırakılmıştır.

***

# Auto pilot

- "A" veya "a" tuşuna basıldığında, "auto pilot" açılır.

- Sağ üst köşede, auto pilot sisteminin açık veya kapalı olduğu bilgisi mevcuttur.

- Auto pilot, bir sonraki hedefe (dik açılar oluşturarak) ulaşabileceği en kısa mesafe için BFS (Breadth First Search) algoritmasını kullanmaktadır. Ayrıca auto pilot, en kısa mesafeyi hesaplarken duvarlardan da geçebilmektedir.

- Auto pilot kullanılırken "yön tuşları" çalışmamaktadır.