define(['knockout'], function (ko) {
    var Poll = function (data) {
        var self = this;
        
        self.id = data.id;
        self.question = data.question;
        self.value = ko.observable();

        self.answers = ko.observableArray();
        self.results = ko.observableArray();

        self.showAnswers = ko.observable(false);
        self.showResults = ko.observable(false);
        self.isSubmitting = ko.observable(false);

        self.submitVote = function () {
            self.isSubmitting(true);
            $.post("/services/get_polls.ashx", { poll_id: self.id, answer_id: self.value() }, function (response) {
                self.showAnswers(false);
                self.showResults(true);
                var _results = ko.utils.arrayMap(response, function (result) {
                    return new Result(result);
                });
                self.results.push.apply(self.results, _results);
            });
        };

        if (data.answers) {
            self.showAnswers(true);
            var _answers = ko.utils.arrayMap(data.answers, function (answer) {
                return new Answer(answer);
            });
            self.answers.push.apply(self.answers, _answers);
        }

        if (data.results) {
            self.showResults(true);
            var _results = ko.utils.arrayMap(data.results, function (result) {
                return new Result(result);
            });
            self.results.push.apply(self.results, _results);
        }
    };

    var Answer = function (data) {
        var self = this;

        self.answer = data.answer;
        self.answer_short = data.answer_short;
        self.id = data.id;
        self.rank = data.rank;
    };

    var Result = function (data) {
        var self = this;

        self.percentage = data.pct;
        self.votes = data.tvotes;
        self.answer = data.answer_text;
        self.answer_short = data.answer_short;
    };

    return Poll;
});