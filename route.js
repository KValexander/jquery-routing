// Файл класса работы с маршрутами
class Route {

	// Метод инициализации класса
	counstruct() {
		// Находимся на главной странице
		window.history.pushState(null, null, '/');
	}

	// Метод проверки адресной строки при загрузке страницы
	check_pathname() {
		// Получение текущего пути
		let pathname = location.pathname;
		// Если путь заканчивается на /, то мы его удаляем
		if(pathname[pathname.length-1] == "/" && pathname.length > 1) pathname = pathname.replace(/.$/,"");

		// Проверка пространства имён
		let check_namespace = route.check_pathname_namespace(pathname);
		// Если проверка обнаружила занятые имена, то прерывание исполнения дальнейшего кода
		if(!check_namespace) return;

		// Если мы не на главной странице
		if(pathname != "/") {
			// Переменная передаваемого пути
			let path = "";
			// Находим название нашего пути
			pathname = pathname.split("/");
			// Прогон всех элементов пути
			for (let i = 1; i < pathname.length; i++) {
				if(pathname.length == 2) path = pathname[i];
				else path += "/" + pathname[i];
			}
			// Переходим на страницу нашего пути
			this.redirect(path);
		// Если на главной
		} else {
			// Переходим на главную страницу
			this.redirect('index');
		}
	}

	// Проверка заготовленных имён путей
	check_pathname_namespace(pathname) {
		// Проверка пространства имён
		switch(pathname) {
			// Путь ошибки авторизации
			case("/auth_err"):
				route.get_page("public/spa/pages/err/auth.html", "auth_err");
				return false; break;
			// Путь ошибки модерации
			case("/moderation_err"):
				route.get_page("public/spa/pages/err/moderation.html", "moderation_err");
				return false; break;
			// Если пространство имён ничего не обнаружило
			default:
				return true; break;
		}
	}

	// Метод перенаправления на нужный маршрут
	redirect(page, id) {
		// Путь до страницы
		let path = "public/spa/pages/" + page + ".html";

		// Название url строки
		let url = "/" + page;

		// Если есть id заявки
		if(id != undefined) url += "/" + id;
		// Если переходим на главную страницу
		if(page == "index") url = "/";

		// Вызов метода перенаправления на нужную страницу
		this.get_page(path, url);
	}

	// Получение страницы с изменением адресной строки
	// без перезагрузки страницы
	get_page(path, url) {
		// Изменение маршрута адресной строки
		window.history.replaceState(null, null, url);

		// AJAX запрос
		$.ajax({
			url: path, // путь
			success: function(data) {
				// Если всё плохо и путь неправилен
				if(data.includes("<!DOCTYPE html>")) return route.redirect("404");
				// Загрузка данных полученной страницы
				$("#app").html(data);
			}
		});
	}

	// Метод для подключения отдельных небольших файлов к странице
	attach_module(path, id_element) {
		// AJAX запрос
		$.ajax({
			url: path, // путь
			success: function(data) {
				// Если всё плохо и путь неправилен
				if(data.includes("<!DOCTYPE html>"))  {
					return $("#" + id_element).html(`
						<h1>Ошибка 404</h1>
						<h3>Такого файла нет</h3>
					`);
				}
				// Загрузка данных в нужный блок
				$("#" + id_element).html(data);
			}
		});
	}

	// Метод очищения модулей
	clear_module(id_element) {
		$("#" + id_element).html("");
	}

	// Метод с AJAX запросом для отправки данных методом get
	get(data, path) {
		// AJAX запрос
		$.ajax({
			url: path, // путь
			method: "GET", // метод
			contentType: "application/json", // тип данных
			data: data, // отправленные данные
			// В случае успеха
			success: function(data) {
				// Возвращение данных
				return data;
			},
			// В случае неудачи
			error: function(jqXHR) {
				// Возвращение данных
				return jqXHR;
			}
		});
	}

	// Метод с AJAX запросом для отправки данных методом post
	post(data, path) {
		// AJAXSetup
		$.ajaxSetup({
			// Заголовки
			headers: {
				// Токен
				"X-CSRF-TOKEN": $("meta[meta='_token']").attr("content")
			}
		});

		// AJAX запрос
		$.ajax({
			url: path, // путь
			method: "POST", // метод
			contentType: "application/json", // тип данных
			data: data, // данные
			// В случае успеха
			success: function(data) {
				// Возвращение данных
				return data;
			},
			// В случае неудачи
			error: function(jqXHR) {
				// Возвращение данных
				return jqXHR;
			}
		});
	}
}

// Создание экземпляра класса
let route = new Route;

// Код срабатывает при загрузке страницы
$(function() {
	// Вызов функции проверки текущего пути
	route.check_pathname();
});