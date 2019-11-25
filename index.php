<?php
// includes
include "functions.php";

// vars
$error_session_status = (isset($_SESSION["error_status"])) ? $_SESSION["error_status"] : 0;
$ball_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]; // define balls vector

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">


    <link rel="stylesheet" href="assets/css/reset.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/libs/micromodal/css/micromodal.css">
    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"
          integrity="sha384-nn4HPE8lTHyVtfCBi5yW9d20FjT8BJwUXyWZT9InLYax14RDjBj46LmSztkmNP9w" crossorigin="anonymous">
    <title>AEGEE</title>
</head>
<body>

<div class="christmas">
    <p>Happy New <b>2019</b> Year!</p>
    <div class="sub-christmas">from <a href="https://www.facebook.com/aegee.spb/" target="_blank">AEGEE-Sankt-Peterburg</a></div>
</div>
<section class="main">
    <div class="tree">
        <?php while ($wish = $total->fetchArray(SQLITE3_ASSOC)) : ?>
            <div class="ball position-<?php echo $wish["position"] ?> taken" data-micromodal-trigger="modal-read"
                 data-name="<?php echo $wish["fname"] ?>" data-l-name="<?php echo $wish["lname"] ?>"
                 data-message="<?php echo $wish["message"] ?>"
                 data-host="<?php echo $wish["host"] ?>"></div>
            <?php unset($ball_nums[$wish["position"] - 1]); ?>
        <?php endwhile; ?>
        <?php foreach ($ball_nums as $num) : ?>
            <div class="ball position-<?php echo $num ?> empty" data-micromodal-trigger="modal-wish"></div>
        <?php endforeach; ?>
    </div>
</section>

<div class="modal micromodal-slide" id="modal-wish" aria-hidden="true">
    <div class="modal__overlay" tabindex="" data-micromodal-close>
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
            <form method="post">
                <header class="modal__header">
                    <h2 class="modal__title" id="modal-1-title">Make a wish 🎁</h2>
                    <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
                </header>
                <main class="modal__content" id="modal-1-content">
                    <label for="modal-wish-name" class="w-100">First Name</label>
                    <input type="text" tabindex="1" name="modal-wish-name" id="modal-wish-name" class="w-100">
                    <label for="modal-wish-last-name" class="w-100">Last Name</label>
                    <input type="text" tabindex="2" name="modal-wish-last-name" id="modal-wish-last-name" class="w-100">
                    <label for="modal-wish-host" class="w-100">Antenna</label>
                    <input type="text" tabindex="3" name="modal-wish-host" id="modal-wish-host" class="w-100">
                    <label for="modal-wish-message" class="w-100">Your wish</label>
                    <textarea rows="10" cols="50" tabindex="4" class="w-100" id="modal-wish-message"
                              name="modal-wish-message"></textarea>
                    <input type="text" id="modal-wish-position" name="modal-wish-position">
                    <div id="modal-wish-hint"></div>
                </main>
                <footer class="modal__footer">
                    <button class="modal__btn modal__btn-primary" tabindex="5" name="submit" id="submit">Hang on with
                        love ♡
                    </button>
                </footer>
            </form>
        </div>
    </div>
</div>

<div class="modal micromodal-slide" id="modal-read" aria-hidden="true">
    <div class="modal__overlay" tabindex="" data-micromodal-close>
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
            <header class="modal__header">
                <h2 id="modal-read-name" class="modal__title"></h2>
                <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
            </header>
            <main class="modal__content" id="modal-1-content">
                <p id="modal-read-message"></p>
            </main>
        </div>
    </div>
</div>

<?php if ($error_session_status): ?>
    <div class="modal micromodal-slide" id="modal-error" aria-hidden="true">
        <div class="modal__overlay" tabindex="" data-micromodal-close>
            <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
                <header class="modal__header">
                    <h2 class="modal__title" id="modal-1-title">Ooops</h2>
                    <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
                </header>
                <main class="modal__content" id="modal-1-content">
                    You have already made a wish.
                </main>
            </div>
        </div>
    </div>
<?php endif; ?>


<script src="https://code.jquery.com/jquery-1.12.4.min.js"
        integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
<script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script> <!-- popup https://micromodal.now.sh/ -->
<script src="https://unpkg.com/imask"></script>

<script src="assets/js/main.js"></script> <!-- project main -->
<script src="assets/libs/snow.js"></script> <!-- popup https://micromodal.now.sh/ -->

</body>
</html>