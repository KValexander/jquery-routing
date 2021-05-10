// Файл класса работы с маршрутами
class Route {

	// Метод инициализации класса
	constructor(path_to_file, expansion) {
		// Путь до папки с фалами и расширение файлов
		this.path_to_file = path_to_file;
		this.expansion = expansion;
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
			// Если путь содержит "-"
			if(pathname.includes("-"))
				// Убираем "/"
				pathname = pathname.substr(1);
			// Находим название нашего пути
			pathname = pathname.split("-");
			// Прогон всех элементов пути
			for (let i = 0; i < pathname.length; i++) {
				if(pathname.length == 1) path = pathname[i];
				else path += "/" + pathname[i];
			}
			// Убираем "/"
			path = path.substr(1);
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
		let path = this.path_to_file + page + "." + this.expansion;

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
		// Замена всех "/" на "-" кроме первого
		// с "/" помимо первой history api корректно не работает
		url = url.replace(/\//g,(i => m => !i++ ? m : '-')(0));

		console.log("===============================");
		console.log("page: " + path);
		console.log("url: " + url);

		// Изменение маршрута адресной строки
		window.history.pushState(null, null, url); // history api

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
	attach_module(path, element_id) {
		console.log("module: " + path);
		// AJAX запрос
		$.ajax({
			url: path, // путь
			success: function(data) {
				// Если всё плохо и путь неправилен
				if(data.includes("<!DOCTYPE html>"))  {
					return $("#" + element_id).html(`
						<h1>Ошибка 404</h1>
						<h3>Такого файла нет</h3>
					`);
				}
				// Загрузка данных в нужный блок
				$("#" + element_id).html(data);
			}
		});
	}

	// Метод очищения модулей
	clear_module(element_id) {
		$("#" + element_id).html("");
	}
}

// Создание экземпляра класса
let route = new Route("public/spa/pages/", "html");

// Код срабатывает при загрузке страницы
$(function() {
	// Вызов функции проверки текущего пути
	route.check_pathname();
});