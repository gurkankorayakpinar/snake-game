# Yılan oyunu

- Bu proje, browser üzerinde çalışan ve "auto pilot" özelliği bulunan bir yılan oyunudur.

***

- Oyun alanı "49 x 29" olarak belirlenmiştir. (BFS algoritmasının duvarlardan geçerken doğru çalışması için tek sayılar tercih edilmiştir.)

- Yılan, duvarlardan ve kendi kuyruğu üzerinden geçebilmektedir.

- Yılan, tek hamlede 180 derece geriye dönebilmektedir.

- Oyun alanında rastgele bir şekilde ortaya çıkan yemlerin, yılanın kuyruğu üzerinde oluşmaları engellenmiştir.

- Yılanın uzunluğu, sol üst köşede görülebilmektedir.

- Yılanın uzunluğu 356 birim olduğunda oyun sona erer.

- Mouse "sağ tık" ile menü açma özelliği devre dışı bırakılmıştır.

***

# Auto pilot

- "A" veya "a" tuşuna basıldığında, "auto pilot" açılır.

- Sağ üst köşede, auto pilot sisteminin açık veya kapalı olduğu bilgisi mevcuttur.

- Auto pilot, bir sonraki hedefe (duvarlardan geçerek veya oyun alanı içerisinde manevra yaparak) ulaşabileceği en kısa mesafe için BFS (Breadth First Search) algoritmasını kullanmaktadır.

- Auto pilot kullanılırken "yön tuşları" çalışmamaktadır.